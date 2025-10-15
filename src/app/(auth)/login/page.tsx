"use client";

import React, { useEffect, useRef, useState } from "react";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { cpfSchema } from "@/lib/validators/cpf";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [cpfError, setCpfError] = useState(false);
  const [senhaError, setSenhaError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const cpfRef = useRef(null);
  const senhaRef = useRef(null);

  useEffect(() => {
    const cpfValue = cpfRef.current?.value;
    const senhaValue = senhaRef.current?.value;

    if (cpfValue) setCpf(cpfValue);
    if (senhaValue) setPassword(senhaValue);
  }, []);

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.substring(0, 11);

    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }

    setCpf(value);
    if (value) setCpfError(false);
  };

  const handleSenhaChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value) setSenhaError(false);
  };

  const handleLogin = async () => {
    let valid = true;
    const rawCpf = cpfSchema.safeParse({ cpf });

    if (!rawCpf.success) {
      setCpfError(true);
      valid = false;
    }

    if (!password) {
      setSenhaError(true);
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
        password,
        redirect: false,
      });

      if (result?.ok) {
        await new Promise((res) => setTimeout(res, 500));

        const session = await getSession();

        if (session?.user) {
          toast.success("Login realizado com sucesso!");
          router.push("/");
        } else {
          console.log("Erro  ", result);
          toast.warning("Sessão ainda não disponível, tente novamente.");
        }
      } else {
        console.log("Erro  ", result);
        toast.error("Usuário ou senha inválidos.");
      }
    } catch (err) {
      console.error("Erro ao logar:", err);
      toast.error("Erro ao tentar login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Login
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Digite seu CPF e senha para realizar o seu login!
            </p>
          </div>
          <div>
            <div className="space-y-6">
              <div>
                <Label htmlFor="cpf">
                  CPF <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  value={cpf}
                  error={cpfError}
                  onChange={handleCpfChange}
                  placeholder="000.000.000-00"
                />
                {cpfError && (
                  <p className="mt-1.5 text-xs text-error-500">
                    O CPF é obrigatório
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">
                  Senha <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    ref={senhaRef}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    error={senhaError}
                    onChange={handleSenhaChange}
                    placeholder="Digite sua senha"
                    className="pr-10"
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleLogin();
                      }
                    }}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <Eye className="w-5 h-5 text-brand-500" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-brand-500" />
                    )}
                  </span>
                </div>
                {senhaError && (
                  <p className="mt-1.5 text-xs text-error-500">
                    A senha é obrigatória
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Manter logado
                  </span>
                </div>
                <Link
                  href="/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
              <div>
                <Button
                  className="w-full"
                  size="sm"
                  disabled={isLoading}
                  onClick={() => handleLogin()}
                >
                  {isLoading ? "Carregando..." : "Logar"}
                </Button>
              </div>
              <div className="text-sm text-center text-gray-600 dark:text-gray-400">
                Versão {process.env.VERSION || "0.0.1"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
