import { BrowserRouter, useRoutes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { networkConfig } from "./config/networkConfig";
import { routes } from './routes';
import './App.css';

const AppRoutes = () => {
  const element = useRoutes(routes);
  return <MainLayout>{element}</MainLayout>;
};

function App() {
  return (
    <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
      <WalletProvider autoConnect>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
    </WalletProvider>
    </SuiClientProvider>
  );
}

export default App;
