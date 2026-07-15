import { useEffect, useCallback } from 'react';
import ReactFlow, { 
  Controls, 
  Background, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  applyNodeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Box, Typography, Button, Paper, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { Download as DownloadIcon, AccountTree as AccountTreeIcon } from '@mui/icons-material';
import { useTreeStore } from '@/modules/family-tree/store/useTreeStore';
import { useMemberStore } from '@/modules/members/store/useMemberStore';
import MemberForm from '@/modules/members/pages/MemberForm';
import CommonLoading from '@/common/components/display/CommonLoading';
import { useNavigate } from 'react-router-dom';
import { Gender } from '@/common/constants';
import FamilyNode from './FamilyNode';

const nodeTypes = {
  familyNode: FamilyNode,
};

const FamilyTreePage = () => {
  const navigate = useNavigate();
  const { treeData, loading, fetchTree, exportTree, resetStore } = useTreeStore();
  
  const {
    openCreateEditPopup,
    handleOpenCreateEdit,
    fetchMembersList
  } = useMemberStore();

  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const theme = useMuiTheme();
  const treeMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const onNodesChangeCustom = useCallback((changes) => {
    setNodes((nds) => {
      // Find position changes to calculate drag delta
      const posChange = changes.find((c) => c.type === 'position' && c.position);
      
      if (posChange) {
        const draggedNode = nds.find((n) => n.id === posChange.id);
        if (draggedNode && posChange.position.y !== undefined) {
          const deltaY = posChange.position.y - draggedNode.position.y;
          
          if (deltaY !== 0) {
            const draggedGeneration = draggedNode.data?.member?.generation;
            
            if (draggedGeneration !== undefined) {
              // 1. Gather all unique generations and their current Y coordinates
              const allGenerations = Array.from(
                new Set(nds.map((n) => n.data?.member?.generation).filter((g) => g !== undefined))
              ).sort((a, b) => a - b);
              
              const currentYPerGen = {};
              allGenerations.forEach((g) => {
                const genNodes = nds.filter((n) => n.data?.member?.generation === g);
                if (genNodes.length > 0) {
                  currentYPerGen[g] = genNodes[0].position.y;
                }
              });
              
              // 2. Set the initial target position for the dragged generation
              const newYPerGen = { ...currentYPerGen };
              newYPerGen[draggedGeneration] = currentYPerGen[draggedGeneration] + deltaY;
              
              const minYGap = 160; // Minimum vertical gap between generations
              
              // 3. Push previous generations upwards sequentially
              for (let i = draggedGeneration - 1; i >= allGenerations[0]; i--) {
                if (currentYPerGen[i] === undefined) continue;
                const maxAllowedY = newYPerGen[i + 1] - minYGap;
                if (newYPerGen[i] > maxAllowedY) {
                  newYPerGen[i] = maxAllowedY;
                }
              }
              
              // 4. Push next generations downwards sequentially
              const maxGen = allGenerations[allGenerations.length - 1];
              for (let i = draggedGeneration + 1; i <= maxGen; i++) {
                if (currentYPerGen[i] === undefined) continue;
                const minAllowedY = newYPerGen[i - 1] + minYGap;
                if (newYPerGen[i] < minAllowedY) {
                  newYPerGen[i] = minAllowedY;
                }
              }
              
              // 5. Generate position adjustments for all other nodes based on their generation's new Y
              const rowChanges = nds
                .filter((n) => n.id !== draggedNode.id)
                .map((n) => {
                  const gen = n.data?.member?.generation;
                  if (gen !== undefined && newYPerGen[gen] !== undefined) {
                    const nodeDeltaY = newYPerGen[gen] - n.position.y;
                    if (nodeDeltaY !== 0) {
                      return {
                        id: n.id,
                        type: 'position',
                        position: {
                          x: n.position.x, // Keep horizontal position
                          y: newYPerGen[gen], // Update to new Y position (pushed)
                        },
                      };
                    }
                  }
                  return null;
                })
                .filter(Boolean);
              
              // Apply the calculated new Y to the currently dragged node
              const updatedChanges = changes.map((c) => {
                if (c.id === posChange.id && c.type === 'position' && c.position) {
                  return {
                    ...c,
                    position: {
                      x: c.position.x,
                      y: newYPerGen[draggedGeneration],
                    },
                  };
                }
                return c;
              });
              
              // Merge changes
              const allChanges = [...updatedChanges];
              rowChanges.forEach((rowChange) => {
                if (!allChanges.some((c) => c.id === rowChange.id)) {
                  allChanges.push(rowChange);
                }
              });
              
              return applyNodeChanges(allChanges, nds);
            }
          }
        }
      }
      
      return applyNodeChanges(changes, nds);
    });
  }, [setNodes]);

  useEffect(() => {
    fetchTree();
    fetchMembersList().catch(() => {});
    return () => {
      resetStore();
    };
  }, [fetchTree, fetchMembersList, resetStore]);

  const handleNodeClick = useCallback((id) => {
    navigate(`/members/${id}`);
  }, [navigate]);

  const handleEditClick = useCallback((member) => {
    fetchMembersList().catch(() => {});
    handleOpenCreateEdit(member);
  }, [fetchMembersList, handleOpenCreateEdit]);

  const handleAddChildClick = useCallback((member) => {
    fetchMembersList(member.id).catch(() => {});
    
    let fatherId = '';
    let motherId = '';

    if (member.gender === 'M') {
      fatherId = member.id;
      if (member.spouse) {
        motherId = member.spouse.id;
      }
    } else if (member.gender === 'F') {
      motherId = member.id;
      if (member.spouse) {
        fatherId = member.spouse.id;
      }
    }

    const defaultValues = {
      generation: (member.generation || 1) + 1,
      fatherId,
      motherId,
    };
    handleOpenCreateEdit(null, defaultValues);
  }, [fetchMembersList, handleOpenCreateEdit]);

  // Convert raw hierarchical tree data into React Flow nodes & edges with dynamic layout positioning
  useEffect(() => {
    if (!treeData) return;

    const nodeWidth = treeMobile ? 260 : 320; // Width including spacing
    const xGap = treeMobile ? 30 : 60;
    const yGap = treeMobile ? 180 : 220;
    
    // Store the right-most X position for each generation layer to prevent overlap
    const nextXForDepth = {};

    const buildLayout = (node, depth = 0) => {
      const idStr = node.id.toString();
      const layoutNode = {
        id: idStr,
        type: 'familyNode',
        data: { 
          member: node, 
          onNodeClick: handleNodeClick,
          onEditClick: handleEditClick,
          onAddChildClick: handleAddChildClick
        },
        position: { x: 0, y: depth * yGap },
      };

      if (!node.children || node.children.length === 0) {
        // Leaf Node: Position at the current next available X for this depth
        const startX = nextXForDepth[depth] !== undefined ? nextXForDepth[depth] + nodeWidth + xGap : 0;
        layoutNode.position.x = startX;
        nextXForDepth[depth] = startX;
        return { nodes: [layoutNode], edges: [] };
      }

      let childNodes = [];
      let childEdges = [];
      let childXs = [];

      node.children.forEach(child => {
        const childLayout = buildLayout(child, depth + 1);
        childNodes.push(...childLayout.nodes);
        childEdges.push(...childLayout.edges);
        
        const childNodeObj = childLayout.nodes.find(n => n.id === child.id.toString());
        if (childNodeObj) {
          childXs.push(childNodeObj.position.x);
        }

        // Create connection edges
        childEdges.push({
          id: `e-${node.id}-${child.id}`,
          source: idStr,
          target: child.id.toString(),
          type: 'smoothstep',
          style: { stroke: '#c5a059', strokeWidth: 2 },
        });
      });

      // Position the parent in the middle of its children
      const minChildX = Math.min(...childXs);
      const maxChildX = Math.max(...childXs);
      let idealX = (minChildX + maxChildX) / 2;

      // Ensure the parent does not overlap with previously placed nodes on its own generation depth
      const minAllowedX = nextXForDepth[depth] !== undefined ? nextXForDepth[depth] + nodeWidth + xGap : 0;
      
      if (idealX < minAllowedX) {
        // If ideal X is blocked, shift the parent AND all its child subtree to the right
        const delta = minAllowedX - idealX;
        idealX = minAllowedX;

        // Collect all descendant IDs to apply the shift
        const childIds = new Set();
        const collectDescendantIds = (n) => {
          if (n.children) {
            n.children.forEach(c => {
              childIds.add(c.id.toString());
              collectDescendantIds(c);
            });
          }
        };
        collectDescendantIds(node);

        childNodes.forEach(n => {
          if (childIds.has(n.id)) {
            n.position.x += delta;
            // Update the nextX tracker for the descendants' levels
            const d = Math.round(n.position.y / yGap);
            if (nextXForDepth[d] === undefined || n.position.x > nextXForDepth[d]) {
              nextXForDepth[d] = n.position.x;
            }
          }
        });
      }

      layoutNode.position.x = idealX;
      nextXForDepth[depth] = idealX;

      return {
        nodes: [layoutNode, ...childNodes],
        edges: [...childEdges],
      };
    };

    const { nodes: layoutNodes, edges: layoutEdges } = buildLayout(treeData, 0);
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [treeData, handleNodeClick, handleEditClick, handleAddChildClick, setEdges, setNodes, treeMobile]);

  if (loading) {
    return <CommonLoading loading={loading} type="skeleton" rows={5} />;
  }

  return (
    <Box sx={{ height: { xs: 'calc(100vh - 140px)', md: 'calc(100vh - 120px)' }, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'flex-start' }, mb: 3, gap: 2 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4" className="serif-title" sx={{ color: 'primary.main', mb: 0.5, fontSize: { xs: '1.5rem', md: '2.125rem' }, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountTreeIcon sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }} /> Sơ đồ Phả hệ Gia tộc
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Xem và tương tác trực quan với sơ đồ phả hệ và mối liên kết dòng tộc
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportTree} size="medium">
            Xuất dữ liệu gia phả
          </Button>
        </Box>
      </Box>

      <Paper
        sx={{
          flexGrow: 1,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          overflow: 'hidden',
          position: 'relative',
        }}
        elevation={0}
      >
        {nodes.length > 0 ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChangeCustom}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.2}
            maxZoom={1.5}
          >
            <Controls />
            {!treeMobile && (
              <MiniMap 
                nodeColor={(n) => {
                  if (n.data?.member?.gender === Gender.MALE) return '#0288d1';
                  return '#f44336';
                }}
                style={{ height: 120 }}
                zoomable
                pannable
              />
            )}
            <Background color="#ccc" gap={16} size={1} />
          </ReactFlow>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography color="textSecondary">
              Sơ đồ gia phả chưa được thiết lập dữ liệu thành viên.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Popup Form thêm/sửa thành viên */}
      {openCreateEditPopup && <MemberForm />}
    </Box>
  );
};

export default FamilyTreePage;
