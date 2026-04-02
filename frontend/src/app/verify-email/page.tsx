import VerifyEmailCard from "@/components/auth/VerifyEmailCard";

type VerifyEmailPageProps = {
    searchParams: Promise<{
        token?: string | string[];
    }>;
};

export default async function VerifyEmailPage({
    searchParams,
}: VerifyEmailPageProps) {
    const { token } = await searchParams;
    const normalizedToken =
        typeof token === "string" ? token : Array.isArray(token) ? token[0] : null;

    return <VerifyEmailCard token={normalizedToken ?? null} />;
}
