import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SuiClientProvider, WalletProvider, ThemeVars } from '@mysten/dapp-kit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { networkConfig } from "./config/networkConfig";
// 导入 dapp-kit 样式
import '@mysten/dapp-kit/dist/index.css'

// 创建查询客户端
const queryClient = new QueryClient()

// 自定义暗色主题
const darkTheme: ThemeVars = {
  blurs: {
    modalOverlay: 'blur(8px)',
  },
  backgroundColors: {
    primaryButton: 'transparent',
    primaryButtonHover: 'rgba(89, 77, 63, 0.1)',
    outlineButtonHover: 'rgba(89, 77, 63, 0.1)',
    modalOverlay: 'rgba(0, 0, 0, 0.6)',
    modalPrimary: '#d2c8b9',
    modalSecondary: '#e5dcd3',
    iconButton: 'transparent',
    iconButtonHover: 'rgba(89, 77, 63, 0.1)',
    dropdownMenu: '#d2c8b9',
    dropdownMenuSeparator: '#e5dcd3',
    walletItemSelected: '#e5dcd3',
    walletItemHover: 'rgba(89, 77, 63, 0.1)',
  },
  borderColors: {
    outlineButton: 'rgba(89, 77, 63, 0.2)',
  },
  colors: {
    primaryButton: '#594d3f',
    outlineButton: '#594d3f',
    iconButton: '#594d3f',
    body: '#594d3f',
    bodyMuted: 'rgba(89, 77, 63, 0.65)',
    bodyDanger: '#ff7875',
  },
  radii: {
    small: '4px',
    medium: '6px',
    large: '8px',
    xlarge: '12px',
  },
  shadows: {
    primaryButton: '0 2px 0 rgba(89, 77, 63, 0.045)',
    walletItemSelected: '0 2px 8px rgba(89, 77, 63, 0.15)',
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    bold: '600',
  },
  fontSizes: {
    small: '14px',
    medium: '16px',
    large: '18px',
    xlarge: '20px',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    fontStyle: 'normal',
    lineHeight: '1.5715',
    letterSpacing: '0.2px',
  },
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider
          autoConnect
          preferredWallets={['sui-wallet', 'ethos', 'suiet']}
          theme={darkTheme}
        >
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </StrictMode>,
)
