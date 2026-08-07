"use client";

import { useCallback, useEffect, useState } from "react";
import { Link2, Plus, Copy, Check, Ban, RotateCcw, Users, AlertTriangle, Loader2 } from "lucide-react";

interface AccessLink {
    id: string;
    token: string;
    label: string;
    created_at: string;
    expires_at: string;
    is_active: boolean;
    uses_count: number;
    last_used_at: string | null;
    distinct_ips: number;
    is_expired: boolean;
    url: string;
}

const DURATIONS = [7, 30, 90, 365];

function formatDate(value: string | null): string {
    if (!value) return "—";
    return new Date(value).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function AccessLinksSection() {
    const [links, setLinks] = useState<AccessLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [label, setLabel] = useState("");
    const [days, setDays] = useState(30);
    const [creating, setCreating] = useState(false);

    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const loadLinks = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/access-links", { cache: "no-store" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Chargement impossible");
            setLinks(data.links ?? []);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur inconnue");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLinks();
    }, [loadLinks]);

    const createLink = async () => {
        if (!label.trim()) return;
        setCreating(true);
        setError(null);
        try {
            const res = await fetch("/api/admin/access-links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ label: label.trim(), days }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Création impossible");
            setLinks((prev) => [data.link, ...prev]);
            setLabel("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur inconnue");
        } finally {
            setCreating(false);
        }
    };

    const toggleLink = async (link: AccessLink) => {
        setTogglingId(link.id);
        setError(null);
        try {
            const res = await fetch(`/api/admin/access-links/${link.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_active: !link.is_active }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Modification impossible");
            setLinks((prev) =>
                prev.map((l) => (l.id === link.id ? { ...l, is_active: data.link.is_active } : l))
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur inconnue");
        } finally {
            setTogglingId(null);
        }
    };

    const copyLink = async (link: AccessLink) => {
        try {
            await navigator.clipboard.writeText(link.url);
            setCopiedId(link.id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            setError("Copie impossible — sélectionne le lien à la main");
        }
    };

    return (
        <div className="bg-[#111111] border border-[#C5A04E]/10 rounded-2xl p-6" dir="ltr">
            <div className="flex items-center gap-3 mb-2">
                <Link2 className="w-5 h-5 text-[#C5A04E]" />
                <h2 className="text-xl font-bold text-white">Liens d&apos;accès</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">
                Ouvre la formation sans compte ni mot de passe. À réserver aux élèves bloqués
                par un problème de connexion — le lien donne accès à quiconque le détient.
            </p>

            {/* Création */}
            <div className="bg-[#0A0A0A] border border-[#C5A04E]/10 rounded-xl p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-3">
                    <input
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !creating && createLink()}
                        placeholder="Pour qui ? (ex : Rachid — bug cookie)"
                        maxLength={120}
                        className="flex-1 bg-[#111111] border border-[#C5A04E]/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#C5A04E] transition-colors"
                    />
                    <select
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        className="bg-[#111111] border border-[#C5A04E]/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C5A04E] transition-colors"
                    >
                        {DURATIONS.map((d) => (
                            <option key={d} value={d}>
                                {d} jours
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={createLink}
                        disabled={creating || !label.trim()}
                        className="inline-flex items-center justify-center gap-2 bg-[#C5A04E] hover:bg-[#d4af5e] disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold px-6 py-3 rounded-xl transition-colors"
                    >
                        {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Créer un lien d&apos;accès
                    </button>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}

            {/* Liste */}
            {loading ? (
                <div className="text-center text-gray-500 py-8">Chargement…</div>
            ) : links.length === 0 ? (
                <div className="text-center text-gray-500 py-8">Aucun lien d&apos;accès créé</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-500 border-b border-[#C5A04E]/10">
                                <th className="text-left font-medium py-3 px-3">Label</th>
                                <th className="text-left font-medium py-3 px-3">Créé le</th>
                                <th className="text-left font-medium py-3 px-3">Expire le</th>
                                <th className="text-left font-medium py-3 px-3">Ouvertures</th>
                                <th className="text-left font-medium py-3 px-3">IP distinctes</th>
                                <th className="text-left font-medium py-3 px-3">Dernier usage</th>
                                <th className="text-left font-medium py-3 px-3">État</th>
                                <th className="text-right font-medium py-3 px-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {links.map((link) => {
                                const dead = !link.is_active || link.is_expired;
                                // Plus d'une IP = le lien a servi ailleurs que sur un seul appareil.
                                const shared = link.distinct_ips > 1;

                                return (
                                    <tr
                                        key={link.id}
                                        className={`border-b border-[#C5A04E]/5 ${dead ? "opacity-45" : ""}`}
                                    >
                                        <td className="py-3 px-3 text-white font-medium">{link.label}</td>
                                        <td className="py-3 px-3 text-gray-500">{formatDate(link.created_at)}</td>
                                        <td className="py-3 px-3 text-gray-500">{formatDate(link.expires_at)}</td>
                                        <td className="py-3 px-3 text-gray-300 font-mono">{link.uses_count}</td>
                                        <td className="py-3 px-3 font-mono">
                                            <span
                                                className={`inline-flex items-center gap-1.5 ${shared ? "text-orange-400" : "text-gray-300"}`}
                                                title={shared ? "Ce lien a été ouvert depuis plusieurs réseaux — il circule peut-être" : undefined}
                                            >
                                                {shared && <Users className="w-3.5 h-3.5" />}
                                                {link.distinct_ips}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 text-gray-500">{formatDate(link.last_used_at)}</td>
                                        <td className="py-3 px-3">
                                            {!link.is_active ? (
                                                <span className="px-2 py-1 rounded-lg text-xs bg-red-500/10 text-red-400">Désactivé</span>
                                            ) : link.is_expired ? (
                                                <span className="px-2 py-1 rounded-lg text-xs bg-gray-500/10 text-gray-400">Expiré</span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-lg text-xs bg-green-500/10 text-green-400">Actif</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => copyLink(link)}
                                                    className="inline-flex items-center gap-1.5 bg-[#0A0A0A] hover:bg-[#1A1A1A] border border-[#C5A04E]/10 text-gray-300 px-3 py-1.5 rounded-lg text-xs transition-colors"
                                                >
                                                    {copiedId === link.id ? (
                                                        <>
                                                            <Check className="w-3.5 h-3.5 text-green-400" /> Copié
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3.5 h-3.5" /> Copier le lien
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => toggleLink(link)}
                                                    disabled={togglingId === link.id}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-40 ${
                                                        link.is_active
                                                            ? "bg-red-500/10 hover:bg-red-500/20 text-red-400"
                                                            : "bg-green-500/10 hover:bg-green-500/20 text-green-400"
                                                    }`}
                                                >
                                                    {togglingId === link.id ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : link.is_active ? (
                                                        <>
                                                            <Ban className="w-3.5 h-3.5" /> Désactiver
                                                        </>
                                                    ) : (
                                                        <>
                                                            <RotateCcw className="w-3.5 h-3.5" /> Réactiver
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
