import { useEffect, useCallback } from 'react';
import ReactFlow, { 
  Controls, 
  Background, 
  MiniMap, 
  useNodesState, 
  useEdgesState 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { useTreeStore } from '@/modules/family-tree/store/useTreeStore';
import CommonLoading from '@/common/components/display/CommonLoading';
import { useNavigate } from 'react-router-dom';
import FamilyNode from './FamilyNode';

const nodeTypes = {
  familyNode: FamilyNode,
};

const FamilyTreePage = () => {
  const navigate = useNavigate();
  const { treeData, loading, fetchTree, exportTree, resetStore } = useTreeStore();
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    fetchTree();
    return () => {
      resetStore();
    };
  }, [fetchTree, resetStore]);

  const handleNodeClick = useCallback((id) => {
    navigate(`/members/${id}`);
  }, [navigate]);

  // Convert raw hierarchical tree data into React Flow nodes & edges with dynamic layout positioning
  useEffect(() => {
    if (!treeData) return;

    const nodeWidth = 320; // Width including spacing
    const xGap = 60;
    const yGap = 220;
    
    // Store the right-most X position for each generation layer to prevent overlap
    const nextXForDepth = {};

    const buildLayout = (node, depth = 0) => {
      const idStr = node.id.toString();
      const layoutNode = {
        id: idStr,
        type: 'familyNode',
        data: { 
          member: node, 
          onNodeClick: handleNodeClick 
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
  }, [treeData, handleNodeClick, setEdges, setNodes]);

  if (loading) {
    return <CommonLoading loading={loading} type="skeleton" rows={5} />;
  }

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" className="serif-title" sx={{ fontWeight: 700, color: 'primary.main' }}>
          🌳 Sơ đồ Phả hệ Gia tộc
        </Typography>
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportTree} size="small">
          Xuất dữ liệu gia phả
        </Button>
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
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.2}
            maxZoom={1.5}
          >
            <Controls />
            <MiniMap 
              nodeColor={(n) => {
                if (n.data?.member?.gender === 'MALE') return '#0288d1';
                return '#f44336';
              }}
              style={{ height: 120 }}
              zoomable
              pannable
            />
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
    </Box>
  );
};

export default FamilyTreePage;
