export function mapApiError(status: number): string | undefined {
  switch (status) {
    case 400:
      return "Os dados enviados são inválidos.";

    case 401:
      return "Sua sessão expirou. Faça login novamente.";

    case 403:
      return "Você não possui permissão para esta ação.";

    case 404:
      return "O recurso solicitado não foi encontrado.";

    case 409:
      return "Este registro já existe.";

    case 422:
      return "Existem campos inválidos no formulário.";

    case 429:
      return "Muitas tentativas. Aguarde alguns instantes.";

    case 500:
      return "Erro interno do servidor.";

    case 503:
      return "Serviço temporariamente indisponível.";

    default:
      return undefined;
  }
}
