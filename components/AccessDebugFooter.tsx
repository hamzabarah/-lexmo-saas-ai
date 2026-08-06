// Marqueur de diagnostic DISCRET, affiché UNIQUEMENT sur les écrans de
// blocage d'abonnement (« الوصول مقيد »). Ce n'est PAS une information
// destinée à l'élève : il sert à identifier, sur une capture d'écran,
// le compte connecté, le build déployé et le projet Supabase interrogé.
type AccessDebugInfo =
    | {
          email?: string | null;
          build?: string;
          env?: string;
          supabaseRef?: string;
      }
    | null
    | undefined;

export default function AccessDebugFooter({ sub }: { sub: AccessDebugInfo }) {
    return (
        <p
            className="mt-8 text-[10px] leading-4 text-gray-700 font-mono select-all"
            dir="ltr"
        >
            {sub?.email ?? '—'} · build {sub?.build ?? '—'}/{sub?.env ?? '—'} · db {sub?.supabaseRef ?? '—'}
        </p>
    );
}
