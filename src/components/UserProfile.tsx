import { Card, Tabs, List, Tag, Typography, Statistic, Row, Col } from 'antd';
import { HeartOutlined, PictureOutlined, DollarOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { mockArtworks } from '../mock/artworks';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const UserProfile = () => {
  const userArtworks = mockArtworks.filter(art => art.owner === "当前用户地址");
  const likedArtworks = mockArtworks.filter(art => art.isLiked);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="user-profile-container"
    >
      <Card className="profile-card">
        <Row gutter={24} className="profile-header">
          <Col span={8}>
            <Statistic 
              title="创建的作品" 
              value={userArtworks.length} 
              prefix={<PictureOutlined />} 
            />
          </Col>
          <Col span={8}>
            <Statistic 
              title="获得的点赞" 
              value={userArtworks.reduce((sum, art) => sum + art.likes, 0)} 
              prefix={<HeartOutlined />} 
            />
          </Col>
          <Col span={8}>
            <Statistic 
              title="获得的收入" 
              value={userArtworks.reduce((sum, art) => sum + art.likes * 0.1, 0)} 
              prefix={<DollarOutlined />}
              precision={2}
              suffix="SUI"
            />
          </Col>
        </Row>

        <Tabs
          items={[
            {
              key: '1',
              label: '我的作品',
              children: (
                <List
                  grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4 }}
                  dataSource={userArtworks}
                  renderItem={item => (
                    <List.Item>
                      <Link to={`/artwork/${item.id}`}>
                        <Card
                          hoverable
                          cover={<div className="artwork-cover" />}
                          className="artwork-card"
                        >
                          <Card.Meta
                            title={item.name}
                            description={
                              <>
                                <Tag color="blue">{item.model}</Tag>
                                <div className="artwork-stats">
                                  <span><HeartOutlined /> {item.likes}</span>
                                  <span><DollarOutlined /> {(item.likes * 0.1).toFixed(2)} SUI</span>
                                </div>
                              </>
                            }
                          />
                        </Card>
                      </Link>
                    </List.Item>
                  )}
                />
              ),
            },
            {
              key: '2',
              label: '点赞的作品',
              children: (
                <List
                  grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4 }}
                  dataSource={likedArtworks}
                  renderItem={item => (
                    <List.Item>
                      <Link to={`/artwork/${item.id}`}>
                        <Card
                          hoverable
                          cover={<div className="artwork-cover" />}
                          className="artwork-card"
                        >
                          <Card.Meta
                            title={item.name}
                            description={
                              <>
                                <Tag color="blue">{item.model}</Tag>
                                <Text type="secondary">支付了 {0.1} SUI</Text>
                              </>
                            }
                          />
                        </Card>
                      </Link>
                    </List.Item>
                  )}
                />
              ),
            },
          ]}
        />
      </Card>
    </motion.div>
  );
};

export default UserProfile; 