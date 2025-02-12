import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Tag, Space, Button, message, Avatar, Divider, Modal, Switch, Input, Form } from 'antd';
import { HeartOutlined, HeartFilled, UserOutlined, ArrowLeftOutlined, ClockCircleOutlined, SettingOutlined, SwapOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { mockArtworks } from '../mock/artworks';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

const ArtworkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [newOwnerAddress, setNewOwnerAddress] = useState('');
  
  const artwork = mockArtworks.find(item => item.id === id);
  const [likes, setLikes] = useState(artwork?.likes || 0);
  const [isPublic, setIsPublic] = useState(artwork?.visibility || true);

  if (!artwork) {
    return <div>作品不存在</div>;
  }

  const handleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
      message.success('已取消点赞');
    } else {
      setLikes(prev => prev + 1);
      message.success('点赞成功');
    }
    setIsLiked(!isLiked);
  };

  const handleVisibilityChange = (checked: boolean) => {
    setIsPublic(checked);
    message.success(`作品已设为${checked ? '公开' : '私密'}`);
  };

  const handleTransfer = () => {
    if (!newOwnerAddress) {
      message.error('请输入新拥有者地址');
      return;
    }
    // 这里添加转移所有权的逻辑
    message.success('作品所有权转移成功！');
    setIsTransferModalVisible(false);
    setNewOwnerAddress('');
  };

  return (
    <motion.div 
      className="artwork-detail-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button 
        icon={<ArrowLeftOutlined />} 
        className="back-button"
        onClick={() => navigate(-1)}
      >
        返回
      </Button>

      <Card className="detail-card">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="artwork-header">
            <Title level={2} className="artwork-title">
              {artwork.name}
            </Title>
            
            <Button
              icon={<SettingOutlined />}
              onClick={() => setIsSettingsVisible(true)}
              className="settings-button"
            >
              设置
            </Button>
          </div>
          
          <div className="artwork-meta">
            <Space size={24} align="center">
              <Space>
                <Avatar icon={<UserOutlined />} size="large" />
                <span className="owner-name">{artwork.owner}</span>
              </Space>
              <Tag color="blue" className="model-tag-large">
                {artwork.model}
              </Tag>
              {artwork.createdAt && (
                <Space>
                  <ClockCircleOutlined />
                  <span className="creation-time">{artwork.createdAt}</span>
                </Space>
              )}
            </Space>
          </div>

          <Divider />

          <div className="artwork-content">
            <Paragraph className="artwork-desc">
              {artwork.desc}
            </Paragraph>
            
            <Paragraph className="artwork-text">
              {artwork.content}
            </Paragraph>
          </div>

          <div className="artwork-actions">
            <Button 
              type={isLiked ? "primary" : "default"}
              icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
              onClick={handleLike}
              className="like-button"
              size="large"
            >
              {likes} 赞
            </Button>
          </div>
        </motion.div>
      </Card>

      <Modal
        title="作品设置"
        open={isSettingsVisible}
        footer={null}
        onCancel={() => setIsSettingsVisible(false)}
      >
        <div className="settings-content">
          <div className="setting-item">
            <Space size="large">
              <span className="setting-label">
                <EyeOutlined /> 作品可见性
              </span>
              <Switch
                checked={isPublic}
                onChange={handleVisibilityChange}
                checkedChildren="公开"
                unCheckedChildren="私密"
              />
            </Space>
          </div>
          
          <Divider />
          
          <div className="setting-item">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <span className="setting-label">
                <SwapOutlined /> 转移作品所有权
              </span>
              <Button 
                type="primary" 
                onClick={() => setIsTransferModalVisible(true)}
                icon={<SwapOutlined />}
              >
                转移所有权
              </Button>
            </Space>
          </div>
        </div>
      </Modal>

      <Modal
        title="转移作品所有权"
        open={isTransferModalVisible}
        onOk={handleTransfer}
        onCancel={() => setIsTransferModalVisible(false)}
        okText="确认转移"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Form.Item
            label="新拥有者地址"
            required
            tooltip="请输入接收者的钱包地址"
          >
            <Input
              placeholder="请输入新拥有者的地址"
              value={newOwnerAddress}
              onChange={e => setNewOwnerAddress(e.target.value)}
              prefix={<UserOutlined />}
            />
          </Form.Item>
          <div className="transfer-warning">
            注意：转移后将无法撤销，请确认接收地址正确！
          </div>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default ArtworkDetail; 