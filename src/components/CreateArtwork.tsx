import { Form, Input, Select, Button, Typography, message, Card, Space } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SendOutlined, LoadingOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

const CreateArtwork = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    setLoading(true);
    // 模拟提交
    setTimeout(() => {
      message.success('作品发布成功！');
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <motion.div 
      className="create-artwork-container"
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

      <Card className="create-form-card">
        <Title level={2} className="page-title">创作新作品</Title>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="create-form"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Form.Item
              name="name"
              label="作品标题"
              rules={[{ required: true, message: '请输入作品标题' }]}
            >
              <Input size="large" placeholder="给你的作品起个名字" />
            </Form.Item>

            <Form.Item
              name="desc"
              label="作品简介"
              rules={[{ required: true, message: '请输入作品简介' }]}
            >
              <TextArea 
                rows={4} 
                placeholder="简单介绍一下你的作品"
                showCount
                maxLength={200}
              />
            </Form.Item>

            <Form.Item
              name="content"
              label="作品内容"
              rules={[{ required: true, message: '请输入作品内容' }]}
            >
              <TextArea 
                rows={8} 
                placeholder="在这里创作你的内容"
                showCount
                maxLength={1000}
              />
            </Form.Item>

            <Form.Item
              name="model"
              label="作品类型"
              rules={[{ required: true, message: '请选择作品类型' }]}
            >
              <Select size="large">
                <Select.Option value="LITERATURE">文学</Select.Option>
                <Select.Option value="VIDEO">视频</Select.Option>
                <Select.Option value="PAINTING">绘画</Select.Option>
                <Select.Option value="EMOJI">表情包</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Space size="middle">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={loading ? <LoadingOutlined /> : <SendOutlined />}
                  size="large"
                  className="submit-button"
                >
                  发布作品
                </Button>
                <Button 
                  size="large" 
                  onClick={() => navigate(-1)}
                  className="cancel-button"
                >
                  取消
                </Button>
              </Space>
            </Form.Item>
          </motion.div>
        </Form>
      </Card>
    </motion.div>
  );
};

export default CreateArtwork; 