import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import { Article as ArticleIcon } from '@mui/icons-material';
import { useDashboardStore } from '@/modules/dashboard/store/useDashboardStore';

const FeaturedPosts = () => {
  const { featuredPosts } = useDashboardStore();
  const navigate = useNavigate();

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" className="serif-title" sx={{ mb: 2, color: 'primary.main' }}>
          📰 Tin tức & Hoạt động nổi bật
        </Typography>
        {featuredPosts.length === 0 ? (
          <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
            Không có tin nổi bật nào mới đăng.
          </Typography>
        ) : (
          <List disablePadding>
            {featuredPosts.map((post, idx) => (
              <React.Fragment key={post.id || idx}>
                <ListItemButton
                  alignItems="flex-start"
                  sx={{
                    px: 1,
                    py: 1.5,
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                  onClick={() => navigate(`/posts/${post.id}`)}
                >
                  <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                    <ArticleIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.4 }}>
                        {post.title}
                      </Typography>
                    }
                    secondary={
                      <Typography component="span" variant="body2" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                        {post.summary || 'Không có tóm tắt...'}
                      </Typography>
                    }
                  />
                </ListItemButton>
                {idx < featuredPosts.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default FeaturedPosts;
