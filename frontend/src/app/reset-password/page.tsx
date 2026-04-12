import ResetPasswordCard from "@/components/auth/ResetPasswordCard";

type ResetPasswordPageProps = {
    searchParams: Promise<{
        token?: string | string[];
    }>;
};

export default async function ResetPasswordPage({
    searchParams,
}: ResetPasswordPageProps) {
    const { token } = await searchParams;
    const normalizedToken =
        typeof token === "string" ? token : Array.isArray(token) ? token[0] : null;

    return <ResetPasswordCard token={normalizedToken ?? null} />;
}
