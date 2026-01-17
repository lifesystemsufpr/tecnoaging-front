module.exports = {
  apps: [
    {
      name: "TecnoAging-front",
      cwd: "/opt/tecnoaging/front/current",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        NEXTAUTH_URL: "https://devenv.tecnoaging.com.br",
        NEXT_PUBLIC_API_BASE_URL: "https://devenv.tecnoaging.com.br/api"
      }
    }
  ]
}