
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  import tailwindcss from '@tailwindcss/vite';
  import path from 'path';

  export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'sonner@2.0.3': 'sonner',
        'react-resizable-panels@2.1.7': 'react-resizable-panels',
        'react-hook-form@7.55.0': 'react-hook-form',
        'lucide-react@0.487.0': 'lucide-react',
        'figma:asset/f165fadc65db69eb9ce3d5feeb2f6b4dc2638bd6.png': path.resolve(__dirname, './src/assets/f165fadc65db69eb9ce3d5feeb2f6b4dc2638bd6.png'),
        'figma:asset/ecb04190c46a6ecd790d2bc345d963ba9a4a8f0b.png': path.resolve(__dirname, './src/assets/ecb04190c46a6ecd790d2bc345d963ba9a4a8f0b.png'),
        'figma:asset/e653b0a7cada3ea08e52cb29bc4bd546be59d3d5.png': path.resolve(__dirname, './src/assets/e653b0a7cada3ea08e52cb29bc4bd546be59d3d5.png'),
        'figma:asset/d6c155d2820ba2910285fbcb066152b9efb7141c.png': path.resolve(__dirname, './src/assets/d6c155d2820ba2910285fbcb066152b9efb7141c.png'),
        'figma:asset/d079eb97740cfc99faff918cd5b541af02c9318a.png': path.resolve(__dirname, './src/assets/d079eb97740cfc99faff918cd5b541af02c9318a.png'),
        'figma:asset/bc4adf9e89b5ade28461d7ae6da09053ea8bf0e1.png': path.resolve(__dirname, './src/assets/bc4adf9e89b5ade28461d7ae6da09053ea8bf0e1.png'),
        'figma:asset/b07b1535d0d656029e5b3942f78ecf273f5852ee.png': path.resolve(__dirname, './src/assets/b07b1535d0d656029e5b3942f78ecf273f5852ee.png'),
        'figma:asset/ac6e3391c1eb88804cbf0804668d449463a1e1a3.png': path.resolve(__dirname, './src/assets/ac6e3391c1eb88804cbf0804668d449463a1e1a3.png'),
        'figma:asset/a9b0f43698a9015397dc60f26d1ea217390fec97.png': path.resolve(__dirname, './src/assets/a9b0f43698a9015397dc60f26d1ea217390fec97.png'),
        'figma:asset/98e154a19d1590d43b04308d53726a30a29e972b.png': path.resolve(__dirname, './src/assets/98e154a19d1590d43b04308d53726a30a29e972b.png'),
        'figma:asset/92bf997c1cf70ce40779ccbb1f4109d30f83d563.png': path.resolve(__dirname, './src/assets/92bf997c1cf70ce40779ccbb1f4109d30f83d563.png'),
        'figma:asset/88d3d6e7f0cac8b8bba0a46f8757585fe7cdaf9a.png': path.resolve(__dirname, './src/assets/88d3d6e7f0cac8b8bba0a46f8757585fe7cdaf9a.png'),
        'figma:asset/87b552f8867f96fa4d2ca833ef943c5aa1ab172b.png': path.resolve(__dirname, './src/assets/87b552f8867f96fa4d2ca833ef943c5aa1ab172b.png'),
        'figma:asset/8449365f45bb140bf269f6769f74387249864ed8.png': path.resolve(__dirname, './src/assets/8449365f45bb140bf269f6769f74387249864ed8.png'),
        'figma:asset/82646def8a61cdad4e2cbba3209910b1f157760c.png': path.resolve(__dirname, './src/assets/82646def8a61cdad4e2cbba3209910b1f157760c.png'),
        'figma:asset/81759343e3c0735a95d3ee5a5e7cf7a767e83846.png': path.resolve(__dirname, './src/assets/81759343e3c0735a95d3ee5a5e7cf7a767e83846.png'),
        'figma:asset/78530a18370215c595d4c989d64c188f7450dbda.png': path.resolve(__dirname, './src/assets/78530a18370215c595d4c989d64c188f7450dbda.png'),
        'figma:asset/776e838a4088fe446d0c5d29220b88ab1ad922bc.png': path.resolve(__dirname, './src/assets/776e838a4088fe446d0c5d29220b88ab1ad922bc.png'),
        'figma:asset/737725172f66f16b2662ff1ddc8ab69293de567f.png': path.resolve(__dirname, './src/assets/737725172f66f16b2662ff1ddc8ab69293de567f.png'),
        'figma:asset/5b6944cca1f1ab3d84ca7f9d682db0a94d709b01.png': path.resolve(__dirname, './src/assets/5b6944cca1f1ab3d84ca7f9d682db0a94d709b01.png'),
        'figma:asset/58a97c06b4ae6edfc613d20add2fb4ead0363c64.png': path.resolve(__dirname, './src/assets/58a97c06b4ae6edfc613d20add2fb4ead0363c64.png'),
        'figma:asset/582c3092ab4289e3ee77a5db51a7f925417c48bf.png': path.resolve(__dirname, './src/assets/582c3092ab4289e3ee77a5db51a7f925417c48bf.png'),
        'figma:asset/4de2970b2569ea8ce82043f8d0b9e3e6dc62fed9.png': path.resolve(__dirname, './src/assets/4de2970b2569ea8ce82043f8d0b9e3e6dc62fed9.png'),
        'figma:asset/3598e566543c9c6ef7ab3cb268538a29b6bdb58d.png': path.resolve(__dirname, './src/assets/3598e566543c9c6ef7ab3cb268538a29b6bdb58d.png'),
        'figma:asset/9f2b842327a3c3f28d84a51e60f0896068694af1.png': path.resolve(__dirname, './src/assets/9f2b842327a3c3f28d84a51e60f0896068694af1.png'),
        'figma:asset/8f3d961604e71dc986f84219e4385ec8ddbb9390.png': path.resolve(__dirname, './src/assets/8f3d961604e71dc986f84219e4385ec8ddbb9390.png'),
        'figma:asset/9c6ade6293dd93b2c95d2803f6fde312b07e0200.png': path.resolve(__dirname, './src/assets/9c6ade6293dd93b2c95d2803f6fde312b07e0200.png'),
        'figma:asset/9d2cc7fac2d909a359d4c845c882543b2770c891.png': path.resolve(__dirname, './src/assets/9d2cc7fac2d909a359d4c845c882543b2770c891.png'),
        'figma:asset/1850125514f29104c8f00034a7873528b971a815.png': path.resolve(__dirname, './src/assets/1850125514f29104c8f00034a7873528b971a815.png'),
        'class-variance-authority@0.7.1': 'class-variance-authority',
        '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
        '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
        '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
        '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
        '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
        '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
        '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      port: 3000,
      /** 固定 IPv4，与 Playwright baseURL、文档中的链接一致，避免只绑定 IPv6 时本机打不开 */
      host: "127.0.0.1",
      open: true,
    },
  });