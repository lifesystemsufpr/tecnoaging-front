import { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FormHeader from "../components/FormHeader";
import { LoginInputs } from "../components/LoginInputs";
import { cpfSchema } from "@/core/libs/validators";
import { Box, Button, Checkbox } from "@/core/components/ui";

export interface FormData {
  cpf: string;
  password: string;
}

const initialFormData: FormData = {
  cpf: "",
  password: "",
};

export default function LoginForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleLogin = async () => {
    let valid = true;
    setFormErrors({});
    const rawCpf = cpfSchema.safeParse({ cpf: formData.cpf });

    if (!rawCpf.success) {
      setFormErrors((prev) => ({ ...prev, cpf: "CPF inválido" }));
      valid = false;
    }

    if (!formData.password) {
      setFormErrors((prev) => ({ ...prev, password: "Senha é obrigatória" }));
      valid = false;
    }

    if (!valid) {
      toast.error("Preencha os campos obrigatórios corretamente.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username: rawCpf.data.cpf,
        password: formData.password,
        remember: isChecked,
        redirect: false,
        callbackUrl: "/",
      });

      if (!result) {
        toast.error("Erro inesperado ao realizar login.");
        return;
      }

      if (result.error) {
        toast.error("Usuário ou senha inválidos.");
        return;
      }

      toast.success("Login realizado com sucesso!");

      const targetUrl = result.url ?? "/";
      if (targetUrl.startsWith("http")) {
        window.location.href = targetUrl;
      } else {
        console.log("Redirecionando para:", targetUrl);
        router.replace(targetUrl);
      }
    } catch (err) {
      console.error("Erro ao logar:", err);
      toast.error("Erro ao tentar login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box display="flex" direction="column" gap={24} className="w-full">
      <FormHeader
        subtitle="Digite seu CPF e senha para realizar o seu login!"
        title="Login"
      />
      <LoginInputs
        onChange={handleChange}
        error={formErrors}
        handleLogin={handleLogin}
      />
      <Box
        display="flex"
        direction="row"
        justify="space-between"
        gap={8}
        className="w-full"
      >
        <Checkbox
          id="remember"
          name="remember"
          label="Manter-me logado"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <a href="/forgot-password" className="text-sm hover:underline">
          Esqueceu sua senha?
        </a>
      </Box>
      <Button
        size="lg"
        className="w-full"
        onClick={handleLogin}
        disabled={isLoading}
      >
        Entrar
      </Button>
    </Box>
  );
}
