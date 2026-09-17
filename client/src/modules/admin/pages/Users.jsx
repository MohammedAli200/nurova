import React, { useEffect, useState } from "react";
import { Search, Users as UsersIcon, Mail, User, AlertCircle } from "lucide-react";
import { getUsers } from "../services/adminService";
import ClayCard from "../../../components/ui/ClayCard";
import ClayInput from "../../../components/ui/ClayInput";
import ClayButton from "../../../components/ui/ClayButton";
import ClaySkeleton from "../../../components/ui/ClaySkeleton";
import ClayEmptyState from "../../../components/ui/ClayEmptyState";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await getUsers({
                search: search || undefined,
            });

            setUsers(result.users || []);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Unable to retrieve registered user directory."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const submitSearch = (e) => {
        e.preventDefault();
        loadUsers();
    };

    return (
        <div className="space-y-6 font-georama animate-page-entrance">
            {/* Header Section */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bitcount text-burntOrange text-xs sm:text-sm tracking-widest uppercase font-bold">
                        USER DIRECTORY
                    </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-forest tracking-tight">
                    Registered Users
                </h1>

                <p className="text-forest/70 mt-1.5 text-sm font-medium">
                    View and search registered patient and community member accounts across Nurova.
                </p>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="p-4 rounded-2xl bg-warmBeige text-burntOrange border border-burntOrange/30 shadow-[inset_2px_2px_4px_rgba(201,120,75,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] flex items-center justify-between gap-3 text-xs font-semibold">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                    <button
                        type="button"
                        onClick={loadUsers}
                        className="underline hover:text-forest"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Search Toolbar */}
            <ClayCard level="2" className="p-4 sm:p-5">
                <form
                    onSubmit={submitSearch}
                    className="flex flex-col sm:flex-row items-center gap-3"
                >
                    <div className="flex-1 w-full">
                        <ClayInput
                            type="text"
                            placeholder="Search by username or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            icon={Search}
                        />
                    </div>

                    <div className="w-full sm:w-auto">
                        <ClayButton
                            type="submit"
                            variant="forest"
                            size="md"
                            icon={Search}
                            fullWidth={false}
                        >
                            Search Directory
                        </ClayButton>
                    </div>
                </form>
            </ClayCard>

            {/* Users Data Display */}
            {loading ? (
                <div className="clay-surface-2 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <ClaySkeleton className="h-6 w-36" />
                        <ClaySkeleton className="h-6 w-24" />
                    </div>
                    {[1, 2, 3, 4].map((i) => (
                        <ClaySkeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            ) : !users.length ? (
                <ClayEmptyState
                    icon={UsersIcon}
                    title="No Users Found"
                    description="There are no registered users matching your search term."
                />
            ) : (
                <ClayCard level="2" className="p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-forest/10 bg-warmBeige/60">
                                    <th className="p-4 sm:p-5 text-xs font-bold uppercase tracking-wider text-forest/70">
                                        Member / Username
                                    </th>

                                    <th className="p-4 sm:p-5 text-xs font-bold uppercase tracking-wider text-forest/70">
                                        Email Address
                                    </th>

                                    <th className="p-4 sm:p-5 text-xs font-bold uppercase tracking-wider text-forest/70">
                                        Bio & Statement
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-forest/10">
                                {users.map((user) => {
                                    const initial = (user.username?.[0] || user.email?.[0] || "U").toUpperCase();
                                    return (
                                        <tr
                                            key={user._id}
                                            className="hover:bg-white/30 transition-colors duration-150"
                                        >
                                            {/* Username & Avatar */}
                                            <td className="p-4 sm:p-5 font-bold text-forest text-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-forest text-sand flex items-center justify-center text-xs font-bold shadow-[2px_2px_4px_rgba(53,92,69,0.2)] flex-shrink-0">
                                                        {initial}
                                                    </div>
                                                    <span className="truncate max-w-xs">{user.username || "—"}</span>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="p-4 sm:p-5 text-forest/80 text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-3.5 h-3.5 text-forest/50 flex-shrink-0" />
                                                    <span className="truncate max-w-xs">{user.email}</span>
                                                </div>
                                            </td>

                                            {/* Bio */}
                                            <td className="p-4 sm:p-5 text-forest/70 text-xs sm:text-sm font-medium max-w-md">
                                                <p className="line-clamp-2 leading-relaxed">
                                                    {user.bio || "No bio added."}
                                                </p>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </ClayCard>
            )}
        </div>
    );
};

export default Users;