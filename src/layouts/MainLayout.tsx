import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { AppstoreOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { menuItems } from '../routes';
import { ConnectButton } from '@mysten/dapp-kit';

const { Header, Content, Footer } = Layout;

const iconMap: Record<string, React.ReactNode> = {
  AppstoreOutlined: <AppstoreOutlined />,
  PlusCircleOutlined: <PlusCircleOutlined />,
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  const menuConfig = menuItems.map(item => ({
    key: item.key,
    icon: iconMap[item.icon],
    label: <Link to={item.path}>{item.label}</Link>,
  }));

  const currentKey = menuItems.find(item => item.path === location.pathname)?.key || '1';

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            ChiliSmile
          </Link>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[currentKey]}
            items={menuConfig}
            className="nav-menu"
          />
          <ConnectButton />
        </div>
      </Header>
      
      <Content style={{ padding: '24px', background: '#fff' }}>
        {children}
      </Content>

      <Footer style={{ textAlign: 'center', background: '#fff' }}>
        ChiliSmile ©{new Date().getFullYear()} - 快乐创作，分享欢乐
      </Footer>
    </Layout>
  );
};

export default MainLayout; 