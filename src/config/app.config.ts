export interface AppConfig {
  nodeEnv: string;
  port: number;
}

export default (): { app: AppConfig } => ({
  app: {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT) || 3000,
  },
});
