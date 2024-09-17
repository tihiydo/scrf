declare global 
{
  namespace NodeJS 
  {
    interface ProcessEnv 
    {
        DATABASE_HOST: string,
        DATABASE_USER: string,
        DATABASE_NAME: string,
        DATABASE_PASSWORD: string,
        DATABASE_PORT: string,
        DATABASE_SSL: string,
    }
  }
}

export {}