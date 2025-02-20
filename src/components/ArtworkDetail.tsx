import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Tag, Space, Button, message, Avatar, Divider, Modal, Switch, Input, Form, Spin } from 'antd';
import { HeartOutlined, HeartFilled, UserOutlined, ArrowLeftOutlined, ClockCircleOutlined, SettingOutlined, SwapOutlined, EyeOutlined } from '@ant-design/icons';
import { useState, useContext, useEffect } from 'react';
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Context } from '../layouts/MainLayout';
import { Artwork } from '../lib/constants';
import { unLikeArtwork, likeArtwork, queryState, queryObjs } from '../lib/common';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

const ArtworkDetail = () => {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { id } = useParams();
  const navigate = useNavigate();
  const { userLikes, profile } = useContext(Context);
  const [artwork, setArtwork] = useState<Artwork>();
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [newOwnerAddress, setNewOwnerAddress] = useState('');
  const [isPublic, setIsPublic] = useState<boolean>(artwork?.show || true);

  const fetchArtworks = async () => {
    const atAddress = await queryState();
    const artworks = await queryObjs<Artwork>(atAddress);
    console.log('artworks list-----> :Promise<T[]>', artworks);
    setArtwork(() => artworks.find(item => item.id.id === id));
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  if (!artwork) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px' 
      }}>
        <Spin tip="加载中..." size="large" />
      </div>
    );
  }

  const handleLike = async (artwork: Artwork) => {
    let at_address = artwork.id.id;
    let tx;
    try {
      const hasLiked = userLikes.likeBalance.has(at_address);
      console.log('当前点赞状态:', hasLiked);

      if (hasLiked) {
        console.log('准备取消点赞');
        tx = await unLikeArtwork(at_address, profile.id.id);
      } else {
        console.log('准备点赞');
        tx = await likeArtwork(at_address, profile.id.id);
      }

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            if (hasLiked) {
              artwork.likes = (parseInt(artwork.likes) - 1) + '';
              message.success('已取消点赞');
              userLikes.likeBalance.delete(at_address);
            } else {
              artwork.likes = (parseInt(artwork.likes) + 1) + '';
              message.success('点赞成功');
              userLikes.likeBalance.set(at_address, 10000000);
            }
          },
          onError: (error) => {
            console.error('交易失败:', error);
            message.error('操作失败，请重试');
          },
        },
      );
    } catch (error) {
      console.error('处理点赞失败:', error);
      message.error('操作失败，请重试');
    }
  };

  const handleVisibilityChange = (checked: boolean) => {
    setIsPublic(() => checked);
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
                {artwork.model.variant}
              </Tag>
              {artwork.create_time && (
                <Space>
                  <ClockCircleOutlined />
                  <span className="creation-time">{artwork.create_time}</span>
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
              type={userLikes.likeBalance.has(artwork.id.id) ? "primary" : "default"}
              icon={userLikes.likeBalance.has(artwork.id.id) ? <HeartFilled /> : <HeartOutlined />}
              onClick={()=>  handleLike(artwork)}
              className="like-button"
              size="large"
            >
              {artwork.likes} 赞
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