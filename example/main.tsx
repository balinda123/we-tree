import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css'; // antd v4
import { CheckTree } from 'mix-tree';
import { Layout, Menu, Typography, Switch, Divider, Tag } from 'antd';
import { CheckSquareOutlined, SettingOutlined, BugOutlined } from '@ant-design/icons';
import './index.css';

const { Header, Sider, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const mockTreeData = [
  {
    title: '🌐 集团总部',
    key: '0',
    children: [
      {
        title: '💻 研发中心',
        key: '0-1',
        children: [
          { title: '前端架构组', key: '0-1-1' },
          { title: 'Java 后端组', key: '0-1-2' },
          { title: '自动化测试组', key: '0-1-3' },
        ],
      },
      {
        title: '📱 产品中心',
        key: '0-2',
        children: [
          { title: 'B端业务组', key: '0-2-1' },
          { title: 'C端增长组', key: '0-2-2' },
        ],
      },
      {
        title: '🎨 设计中心',
        key: '0-3',
      }
    ],
  },
];

const App = () => {
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  // 属性控制器
  const [openSearch, setOpenSearch] = useState(true);
  const [blockNode, setBlockNode] = useState(true);
  const [spcialHalfCheck, setSpcialHalfCheck] = useState(true);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={260} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
        <div className="logo">🌲 mix-tree</div>
        <Menu mode="inline" defaultSelectedKeys={['1']} style={{ borderRight: 0, padding: '12px 0' }}>
          <Menu.ItemGroup title="组件 Components">
            <Menu.Item key="1" icon={<CheckSquareOutlined />}>CheckTree 选择树</Menu.Item>
            <Menu.Item key="2" disabled icon={<BugOutlined />}>其他组件开发中...</Menu.Item>
          </Menu.ItemGroup>
        </Menu>
      </Sider>
      
      <Layout>
        <Header className="site-header">
          <Title level={4} style={{ margin: 0, color: '#1890ff', fontWeight: 600 }}>组件调试台</Title>
        </Header>
        
        <Content style={{ margin: '24px', overflow: 'initial' }}>
          <div className="content-container">
            <div className="component-desc">
              <Title level={2}>CheckTree 可搜索的多选树</Title>
              <Paragraph style={{ fontSize: 16, color: '#595959', maxWidth: 800 }}>
                基于 Ant Design 高度定制化的树形控件。提供了强大的本地搜索、特殊的半选 UI 样式以及高可控的选中数据流，专门用于企业级中后台复杂的部门、人员选择场景。
              </Paragraph>
              <Divider />
            </div>

            <div className="demo-card">
              <div className="demo-header">
                <span className="demo-title">实时交互游乐场 (Playground)</span>
                <Tag color="blue" style={{ borderRadius: 4 }}>Demo</Tag>
              </div>
              <div className="demo-body">
                {/* 左侧：组件预览区 */}
                <div className="demo-preview">
                  <div className="demo-preview-inner">
                    <CheckTree
                      blockNode={blockNode}
                      spcialHalfCheck={spcialHalfCheck}
                      openSearch={openSearch}
                      searchConfig={{ placeholder: '输入关键词搜索部门...' }}
                      treeData={mockTreeData}
                      checkedKeys={checkedKeys}
                      defaultExpandAll
                      onCustomCheck={(keys, info) => {
                        const selectKeys = Array.isArray(keys) ? keys : keys.checked;
                        setCheckedKeys(selectKeys);
                      }}
                    />
                  </div>
                </div>

                {/* 右侧：属性控制与状态查看区 */}
                <div className="demo-controls">
                  <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <SettingOutlined /> 属性面板 Props
                  </Title>
                  <Divider style={{ margin: '12px 0 24px' }} />
                  
                  <div className="control-item">
                    <span className="control-label">开启搜索 (openSearch)</span>
                    <Switch checked={openSearch} onChange={setOpenSearch} />
                  </div>
                  <div className="control-item">
                    <span className="control-label">特殊半选样式 (spcialHalfCheck)</span>
                    <Switch checked={spcialHalfCheck} onChange={setSpcialHalfCheck} />
                  </div>
                  <div className="control-item">
                    <span className="control-label">节点占满整行 (blockNode)</span>
                    <Switch checked={blockNode} onChange={setBlockNode} />
                  </div>
                  
                  <Title level={5} style={{ marginTop: 40, marginBottom: 16 }}>动态状态 State</Title>
                  <div className="state-viewer">
                    {checkedKeys.length > 0 
                      ? JSON.stringify(checkedKeys, null, 2) 
                      : '// 暂无选中的 Key'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
