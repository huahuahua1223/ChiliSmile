import { Card, Row, Col, Typography, Space, Tag, Input, Spin, BackTop } from 'antd';
import { HeartOutlined, EyeOutlined, SearchOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { mockArtworks } from '../mock/artworks';
import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const { Title } = Typography;

const PAGE_SIZE = 8; // 每页显示的数量

const getModelIcon = (model: string) => {
  switch (model) {
    case 'LITERATURE':
      return '📝';
    case 'VIDEO':
      return '🎥';
    case 'PAINTING':
      return '🎨';
    case 'EMOJI':
      return '😊';
    default:
      return '📄';
  }
};

const ArtworkList = () => {
  const [searchText, setSearchText] = useState('');
  const [displayArtworks, setDisplayArtworks] = useState<typeof mockArtworks>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // 根据搜索词过滤作品
  const filteredArtworks = mockArtworks.filter(artwork =>
    artwork.name.toLowerCase().includes(searchText.toLowerCase()) ||
    artwork.desc.toLowerCase().includes(searchText.toLowerCase())
  );

  // 初始化和搜索时重置列表
  useEffect(() => {
    setDisplayArtworks(filteredArtworks.slice(0, PAGE_SIZE));
    setPage(1);
    setHasMore(filteredArtworks.length > PAGE_SIZE);
  }, [searchText]);

  // 加载更多数据
  const loadMore = () => {
    const nextPage = page + 1;
    const start = (nextPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    
    setTimeout(() => {
      const newArtworks = filteredArtworks.slice(start, end);
      setDisplayArtworks(prev => [...prev, ...newArtworks]);
      setPage(nextPage);
      setHasMore(end < filteredArtworks.length);
    }, 500); // 添加延迟模拟加载
  };

  return (
    <div className="artwork-container">
      <div className="artwork-header">
        <Title level={2}>创作广场</Title>
        <Input
          prefix={<SearchOutlined />}
          placeholder="搜索作品..."
          onChange={e => setSearchText(e.target.value)}
        />
      </div>

      <InfiniteScroll
        dataLength={displayArtworks.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin tip="加载中..." />
          </div>
        }
        endMessage={
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
            {displayArtworks.length > 0 ? '已经到底啦 ~' : '暂无作品'}
          </div>
        }
      >
        <Row gutter={[16, 16]}>
          {displayArtworks.map(artwork => (
            <Col xs={24} sm={12} md={8} lg={6} key={artwork.id}>
              <Link to={`/artwork/${artwork.id}`}>
                <Card
                  hoverable
                  className="artwork-card"
                  cover={
                    <div className="artwork-cover">
                      <div className="artwork-type">
                        <span className="model-icon">{getModelIcon(artwork.model)}</span>
                        <span className="model-text">{artwork.model}</span>
                      </div>
                    </div>
                  }
                  actions={[
                    <Space>
                      <HeartOutlined className="action-icon" />
                      <span className="action-count">{artwork.likes}</span>
                    </Space>,
                    <EyeOutlined className="action-icon" />
                  ]}
                >
                  <Card.Meta
                    title={artwork.name}
                    description={
                      <div className="card-description">
                        <div>{artwork.desc}</div>
                        <div className="card-footer">
                          {artwork.createdAt}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </InfiniteScroll>

      <BackTop>
        <div className="back-top-btn">
          <VerticalAlignTopOutlined />
        </div>
      </BackTop>
    </div>
  );
};

export default ArtworkList; 