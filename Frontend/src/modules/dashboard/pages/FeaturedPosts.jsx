import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useDashboardStore } from '@/modules/dashboard/store/useDashboardStore';

const FeaturedPosts = () => {
  const { featuredPosts } = useDashboardStore();

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
          <List>
            {featuredPosts.map((post, idx) => (
              <React.Fragment key={post.id || idx}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemText
                    primary={post.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                          {post.summary || 'Không có tóm tắt...'}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {idx < featuredPosts.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default FeaturedPosts;
