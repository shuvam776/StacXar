
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { auth } from '../firebase/firebase';
import { useRoadmapProgress } from '../hooks/useRoadmapProgress';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiClient } from '../api/apiClient';

interface Project {
    title: string;
    url: string;
    description: string;
}

interface UserProfile {
    fullName: string;
    email: string;
    avatar: string;
    leetcodeUsername: string | null;
    codeforcesUsername: string | null;
    codechefUsername: string | null;
    githubUsername: string | null;
    linkedinUrl: string | null;
    deployedProjects: Project[];
    ranking?: {
        rank: number;
        totalUsers: number;
        tier: string;
        score: number;
        breakdown: {
            dsa: number;
            cp: number;
            github: number;
        }
    }
}

const IdentityItem = React.memo(({
    label,
    value,
    icon,
    platform,
    stats,
    url,
    fieldKey,
    editingField,
    tempValue,
    onEditStart,
    onSave,
    onCancel,
    onValueChange,
    isSaving,
    editValue,
    fullName
}: {
    label: string;
    value: string | null;
    icon: React.ReactNode;
    platform: string;
    stats?: any;
    url?: string;
    fieldKey: string;
    editingField: string | null;
    tempValue: string;
    onEditStart: (key: string, currentVal: string) => void;
    onSave: (key: string) => void;
    onCancel: () => void;
    onValueChange: (val: string) => void;
    isSaving: boolean;
    editValue?: string;
    fullName?: string;
}) => {
    const isEditingThis = editingField === fieldKey;
    const actualEditValue = editValue !== undefined ? editValue : (value || '');

    return (
        <div className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-primary/30 transition-all group relative overflow-hidden min-h-[80px]">
            {!isEditingThis && url && value && (
                <a
                    href={url.startsWith('http') ? url : `https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-10 cursor-pointer"
                    title={`Open ${platform} Profile`}
                />
            )}
            <div className="flex items-center gap-3 md:gap-4 w-full h-full">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors overflow-hidden relative flex-shrink-0 self-center">
                    {stats?.avatar ? (
                        <img src={stats.avatar} alt={platform} className="w-full h-full object-cover" />
                    ) : (
                        icon
                    )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center h-full py-1">
                    <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-0.5">{label}</p>
                    {isEditingThis ? (
                        <div className="flex items-center gap-2 relative z-20 w-full">
                            <input
                                type="text"
                                value={tempValue}
                                onChange={(e) => onValueChange(e.target.value)}
                                className="flex-1 bg-black/50 border border-white/20 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-primary transition-all min-w-0"
                                placeholder={`Enter ${label}...`}
                                autoFocus
                            />
                            <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                    onClick={() => onSave(fieldKey)}
                                    disabled={isSaving}
                                    className="p-2 sm:px-3 sm:py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(22,163,74,0.3)]"
                                    title="Save"
                                >
                                    {isSaving ? (
                                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            <span className="hidden sm:inline text-xs font-bold">Submit</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={onCancel}
                                    disabled={isSaving}
                                    className="p-1.5 text-gray-400 hover:text-white transition-colors"
                                    title="Cancel"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <p className="font-mono text-sm md:text-base text-gray-100 font-bold truncate max-w-[150px] md:max-w-none">
                                {platform === 'linkedin' && value ? (fullName || value) : (value || 'Not connected')}
                            </p>
                            <button
                                onClick={(e) => { e.stopPropagation(); e.preventDefault(); onEditStart(fieldKey, actualEditValue); }}
                                className="p-1.5 text-gray-100 hover:text-primary transition-all relative z-20 bg-zinc-800 rounded-lg border border-white/10 hover:border-primary/50 shadow-lg"
                                title={`Edit ${label}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {!isEditingThis && value && (
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                    <span className="text-[10px] font-black text-gray-500 uppercase hidden sm:inline">Live</span>
                </div>
            )}
        </div>
    );
});

IdentityItem.displayName = 'IdentityItem';

const ProjectItem = React.memo(({ proj, idx, isEditing, onRemove }: { proj: Project; idx: number; isEditing: boolean; onRemove: (idx: number) => void }) => (
    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 relative group hover:border-white/10 transition-colors">
        {isEditing && (
            <button
                onClick={() => onRemove(idx)}
                className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        )}
        <h4 className="font-bold text-lg text-white mb-1">{proj.title}</h4>
        <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline block mb-2 truncate">{proj.url}</a>
        <p className="text-sm text-gray-400">{proj.description}</p>
    </div>
));

ProjectItem.displayName = 'ProjectItem';

const getTierStyle = (tier: string) => {
    switch (tier) {
        case 'Legend': return 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500';
        case 'Grandmaster': return 'bg-red-500/10 border-red-500/50 text-red-500';
        case 'Master': return 'bg-purple-500/10 border-purple-500/50 text-purple-500';
        case 'Diamond': return 'bg-blue-500/10 border-blue-500/50 text-blue-500';
        case 'Platinum': return 'bg-cyan-500/10 border-cyan-500/50 text-cyan-500';
        case 'Gold': return 'bg-yellow-400/10 border-yellow-400/50 text-yellow-400';
        case 'Silver': return 'bg-gray-400/10 border-gray-400/50 text-gray-400';
        default: return 'bg-orange-700/10 border-orange-700/50 text-orange-700';
    }
}

const Profile: React.FC = () => {
    const { roadmapState: dsaState } = useRoadmapProgress('dsa');
    const { roadmapState: webDevState } = useRoadmapProgress('webdev');
    const { roadmapState: appDevState } = useRoadmapProgress('appdev');
    const user = auth.currentUser;

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [isEditingProjects, setIsEditingProjects] = useState(false);

    // Independent state hooks for key fields
    const [fullName, setFullName] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');

    const [tempValue, setTempValue] = useState('');
    const [formData, setFormData] = useState<UserProfile | null>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // New Project State
    const [newProject, setNewProject] = useState<Project>({ title: '', url: '', description: '' });

    const [platformStats, setPlatformStats] = useState<any>({});

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const profileData = await apiClient.get('/profile');

                // Fetch DSA & WebDev data for full stats & platform avatars
                const [dsaData, webData] = await Promise.all([
                    apiClient.get('/dashboard/dsa'),
                    apiClient.get('/dashboard/webdev')
                ]);

                let combinedStats: any = {};
                profileData.ranking = dsaData.ranking;
                combinedStats = { ...combinedStats, leetcode: dsaData.stats?.leetcode, codeforces: dsaData.stats?.codeforces };
                combinedStats = { ...combinedStats, github: webData.stats?.github };

                // LinkedIn stats from local profile data (always available if URL set)
                if (profileData.linkedinUrl) {
                    combinedStats.linkedin = { avatar: profileData.avatar };
                }

                setPlatformStats(combinedStats);
                setProfile(profileData);
                setFormData(profileData);

                // Initialize independent states
                setFullName(profileData.fullName || user.displayName || '');
                setLinkedinUrl(profileData.linkedinUrl || '');
            } catch (err: any) {
                if (err.message?.includes('404')) {
                    // Initialize a skeleton profile for new users
                    const skeleton: UserProfile = {
                        fullName: user.displayName || 'StacXar User',
                        email: user.email || '',
                        avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
                        leetcodeUsername: null,
                        codeforcesUsername: null,
                        codechefUsername: null,
                        githubUsername: null,
                        linkedinUrl: null,
                        deployedProjects: []
                    };
                    setProfile(skeleton);
                    setFormData(skeleton);
                    setFullName(skeleton.fullName);
                    setPlatformStats({});
                } else {
                    console.error("Profile fetch error", err);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleSaveField = async (fieldKey: string) => {
        if (!user) return;
        setSaving(true);
        setMessage(null);

        try {
            const uploadFormData = new FormData();
            // Prepare the update data: start with current profile data or skeleton if null
            const baseProfile = profile || {
                fullName: user.displayName || 'New User',
                email: user.email || '',
                avatar: user.photoURL || '',
                leetcodeUsername: null,
                codeforcesUsername: null,
                codechefUsername: null,
                githubUsername: null,
                linkedinUrl: null,
                deployedProjects: []
            };
            const updatedData = { ...baseProfile, [fieldKey]: tempValue };

            // Special case for fullName if it was updated in header
            if (fieldKey === 'fullName') {
                updatedData.fullName = tempValue;
            }

            (Object.keys(updatedData) as Array<keyof UserProfile>).forEach(key => {
                if (key === 'ranking' || updatedData[key] === null) return;
                if ((key as any) === 'avatarFile') return;
                if (key === 'avatar' && (updatedData as any).avatarFile) return;

                if (key === 'deployedProjects') {
                    uploadFormData.append(key, JSON.stringify(updatedData[key]));
                } else {
                    uploadFormData.append(key, updatedData[key] as string);
                }
            });

            const updatedUser = await apiClient.post('/profile/update', uploadFormData);
            setProfile({ ...updatedUser, ranking: profile?.ranking });

            // Update individual states
            if (fieldKey === 'fullName') setFullName(updatedUser.fullName);
            if (fieldKey === 'linkedinUrl') setLinkedinUrl(updatedUser.linkedinUrl);

            setEditingField(null);
            setMessage({ type: 'success', text: `${fieldKey.replace('Username', '').replace('Url', '').charAt(0).toUpperCase() + fieldKey.replace('Username', '').replace('Url', '').slice(1)} updated!` });

        } catch (err: any) {
            console.error('Error updating profile field:', err);
            setMessage({ type: 'error', text: err.message || 'Failed to update.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleEditStart = (key: string, currentVal: string) => {
        setEditingField(key);
        setTempValue(currentVal);
    };

    const handleCancelEdit = () => {
        setEditingField(null);
        setTempValue('');
    };

    const addProject = React.useCallback(() => {
        if (!formData) return;
        if (!newProject.title || !newProject.url) return;
        const updatedProjects = [...(formData.deployedProjects || []), newProject];
        setFormData({ ...formData, deployedProjects: updatedProjects });
        setNewProject({ title: '', url: '', description: '' });
    }, [formData, newProject]);

    const removeProject = React.useCallback((index: number) => {
        if (!formData) return;
        const updatedProjects = [...(formData.deployedProjects || [])];
        updatedProjects.splice(index, 1);
        setFormData({ ...formData, deployedProjects: updatedProjects });
    }, [formData]);


    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
                {/* Header Section */}
                <section className="relative mb-16 lg:mb-24">
                    <div className="h-48 md:h-64 w-full bg-gradient-to-r from-zinc-900 to-black rounded-[2rem] border border-white/5 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(255,215,0,0.1),transparent)]"></div>
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl flex flex-col items-center md:flex-row md:items-start md:gap-8">
                        <div className="relative group shrink-0">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-zinc-900 border border-white/10 overflow-hidden shadow-2xl relative z-10 transition-transform group-hover:scale-105">
                                {profile?.avatar ? (
                                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                                    </div>
                                )}
                            </div>
                            {editingField === 'avatar' ? (
                                <div className="absolute -bottom-2 -right-2 z-30 flex flex-col items-center gap-2 bg-zinc-900 p-2 rounded-2xl border border-white/10 shadow-2xl">
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    (window as any)._tempAvatarFile = file;
                                                    const reader = new FileReader();
                                                    reader.onload = (ev) => {
                                                        const img = document.querySelector('.group img') as HTMLImageElement;
                                                        if (img) img.src = ev.target?.result as string;
                                                        else {
                                                            const container = document.querySelector('.group .w-24');
                                                            if (container) container.innerHTML = `<img src="${ev.target?.result}" class="w-full h-full object-cover" />`;
                                                        }
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center border border-primary/50">
                                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 011.664.89l.812 1.22A2 2 0 0010.07 10H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={async () => {
                                                if (!user) return;
                                                setSaving(true);
                                                try {
                                                    const uploadFormData = new FormData();
                                                    const file = (window as any)._tempAvatarFile;
                                                    if (file) uploadFormData.append('avatar', file);

                                                    const baseProfile = profile || {
                                                        fullName: user.displayName || 'StacXar User',
                                                        email: user.email || '',
                                                        avatar: user.photoURL || '',
                                                        leetcodeUsername: null,
                                                        codeforcesUsername: null,
                                                        codechefUsername: null,
                                                        githubUsername: null,
                                                        linkedinUrl: null,
                                                        deployedProjects: []
                                                    };

                                                    (Object.keys(baseProfile) as Array<keyof UserProfile>).forEach(key => {
                                                        if (key === 'ranking' || (baseProfile as any)[key] === null || key === 'avatar') return;
                                                        if (key === 'deployedProjects') {
                                                            uploadFormData.append(key, JSON.stringify((baseProfile as any)[key]));
                                                        } else {
                                                            uploadFormData.append(key, (baseProfile as any)[key] as string);
                                                        }
                                                    });

                                                    const updated = await apiClient.post('/profile/update', uploadFormData);
                                                    setProfile({ ...updated, ranking: profile?.ranking });
                                                    setEditingField(null);
                                                    setMessage({ type: 'success', text: 'Avatar updated!' });
                                                } catch (e: any) {
                                                    console.error(e);
                                                    setMessage({ type: 'error', text: e.message || 'Error updating avatar.' });
                                                } finally {
                                                    setSaving(false);
                                                    setTimeout(() => setMessage(null), 3000);
                                                }
                                            }}
                                            className="p-2 bg-green-600 text-white rounded-full hover:bg-green-500 transition-all shadow-[0_0_10px_rgba(22,163,74,0.3)]"
                                            title="Save Avatar"
                                        >
                                            {saving ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            )}
                                        </button>
                                        <button onClick={handleCancelEdit} className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all" title="Cancel">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setEditingField('avatar')}
                                    className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-20 rounded-3xl"
                                >
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                            )}
                        </div>
                        <div className="flex-1 text-center md:text-left min-w-0 flex flex-col items-center md:items-start">
                            <div className="flex flex-col items-center md:items-start gap-1 w-full">
                                {editingField === 'fullName' ? (
                                    <div className="flex items-center justify-center md:justify-start gap-2 w-full max-w-md">
                                        <input
                                            type="text"
                                            value={tempValue}
                                            onChange={(e) => setTempValue(e.target.value)}
                                            className="text-xl md:text-4xl font-black tracking-tight bg-white/10 border border-white/20 rounded-xl px-4 py-1 focus:outline-none focus:border-primary w-full text-center md:text-left"
                                            placeholder="Your Full Name"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleSaveField('fullName')}
                                            disabled={saving}
                                            className="p-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_10px_rgba(22,163,74,0.3)] shrink-0"
                                            title="Save Name"
                                        >
                                            {saving ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                    <span className="hidden sm:inline">Submit</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="p-2 text-gray-400 hover:text-white transition-colors"
                                            title="Cancel"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center md:justify-start gap-3 group/name cursor-default">
                                        <h2 className="text-2xl md:text-4xl font-black tracking-tight truncate max-w-[250px] md:max-w-none">{fullName}</h2>
                                        <button
                                            onClick={() => handleEditStart('fullName', fullName)}
                                            className="p-1.5 text-gray-100 hover:text-primary transition-all bg-zinc-800 rounded-lg border border-white/10 hover:border-primary/50 shadow-md"
                                            title="Edit Name"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                    </div>
                                )}
                                {profile?.ranking && (
                                    <span className="bg-primary text-black text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter shrink-0">
                                        {profile.ranking.tier}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-400 font-medium text-sm md:text-base">{user?.email}</p>
                            {profile?.ranking && (
                                <p className="text-xs font-mono text-gray-500 mt-1">
                                    Rank #{profile.ranking.rank} of {profile.ranking.totalUsers} • Score: {profile.ranking.score.toFixed(0)}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Identity & Links */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 px-4 md:px-0">
                    <div className="bg-zinc-900/50 p-6 md:p-8 rounded-[2.5rem] border border-white/10 text-center md:text-left">
                        <div className="flex justify-center md:justify-start items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <span className="w-2 h-6 bg-primary rounded-full"></span>
                                Identities
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <IdentityItem
                                label="LeetCode"
                                value={profile?.leetcodeUsername || null}
                                platform="leetcode"
                                fullName={fullName}
                                stats={platformStats.leetcode}
                                url={profile?.leetcodeUsername ? `https://leetcode.com/u/${profile.leetcodeUsername}` : undefined}
                                fieldKey="leetcodeUsername"
                                editingField={editingField}
                                tempValue={tempValue}
                                onEditStart={handleEditStart}
                                onSave={handleSaveField}
                                onCancel={handleCancelEdit}
                                onValueChange={setTempValue}
                                isSaving={saving}
                                icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-11.71 11.59a1.374 1.374 0 0 0 0 1.956l11.71 11.59a1.374 1.374 0 0 0 1.922 0l1.71-1.69a1.374 1.374 0 0 0 0-1.956l-9.043-8.948h14.072A1.374 1.374 0 0 0 24 11.59V9.41a1.374 1.374 0 0 0-1.374-1.374H8.12l9.043-8.948a1.374 1.374 0 0 0 0-1.956L15.45.414A1.374 1.374 0 0 0 14.483 0z" /></svg>}
                            />
                            <IdentityItem
                                label="Codeforces"
                                value={profile?.codeforcesUsername || null}
                                platform="codeforces"
                                fullName={fullName}
                                stats={platformStats.codeforces}
                                url={profile?.codeforcesUsername ? `https://codeforces.com/profile/${profile.codeforcesUsername}` : undefined}
                                fieldKey="codeforcesUsername"
                                editingField={editingField}
                                tempValue={tempValue}
                                onEditStart={handleEditStart}
                                onSave={handleSaveField}
                                onCancel={handleCancelEdit}
                                onValueChange={setTempValue}
                                isSaving={saving}
                                icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.5 7.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zM0 12l2.25-3h19.5L24 12l-2.25 3H2.25L0 12z" /></svg>}
                            />
                            <IdentityItem
                                label="CodeChef"
                                value={profile?.codechefUsername || null}
                                platform="codechef"
                                fullName={fullName}
                                stats={platformStats.codechef}
                                url={profile?.codechefUsername ? `https://codechef.com/users/${profile.codechefUsername}` : undefined}
                                fieldKey="codechefUsername"
                                editingField={editingField}
                                tempValue={tempValue}
                                onEditStart={handleEditStart}
                                onSave={handleSaveField}
                                onCancel={handleCancelEdit}
                                onValueChange={setTempValue}
                                isSaving={saving}
                                icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.2 17.5c-0.3 0-0.5-0.1-0.7-0.3l-2.7-2.7c-0.2-0.2-0.3-0.4-0.3-0.7 0-0.3 0.1-0.5 0.3-0.7l2.7-2.7c0.2-0.2 0.4-0.3 0.7-0.3 0.3 0 0.5 0.1 0.7 0.3l0.7 0.7c0.2 0.2 0.3 0.4 0.3 0.7 0 0.3-0.1 0.5-0.3 0.7l-2 2 2 2c0.2 0.2 0.3 0.4 0.3 0.7 0 0.3-0.1 0.5-0.3 0.7l-0.7 0.7c-0.2 0.2-0.4 0.3-0.7 0.3z" /></svg>}
                            />
                            <IdentityItem
                                label="GitHub"
                                value={profile?.githubUsername || null}
                                platform="github"
                                fullName={fullName}
                                stats={platformStats.github}
                                url={profile?.githubUsername ? `https://github.com/${profile.githubUsername}` : undefined}
                                fieldKey="githubUsername"
                                editingField={editingField}
                                tempValue={tempValue}
                                onEditStart={handleEditStart}
                                onSave={handleSaveField}
                                onCancel={handleCancelEdit}
                                onValueChange={setTempValue}
                                isSaving={saving}
                                icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>}
                            />
                            <IdentityItem
                                label="LinkedIn"
                                value={linkedinUrl ? (fullName || 'LinkedIn Profile') : null}
                                platform="linkedin"
                                fullName={fullName}
                                stats={platformStats.linkedin}
                                url={linkedinUrl || undefined}
                                fieldKey="linkedinUrl"
                                editingField={editingField}
                                tempValue={tempValue}
                                onEditStart={handleEditStart}
                                onSave={handleSaveField}
                                onCancel={handleCancelEdit}
                                onValueChange={setTempValue}
                                isSaving={saving}
                                editValue={linkedinUrl || ''}
                                icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>}
                            />
                        </div>

                        {profile?.ranking && (
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-xs font-mono text-gray-500 mt-2">
                                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(255,215,0,0.5)]"></span>
                                    {profile?.email || user?.email}
                                </div>
                                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                                    <span className="text-gray-400 font-bold uppercase tracking-tighter">Joined</span>
                                    {new Date(user?.metadata.creationTime || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </div>
                            </div>
                        )}

                        {profile?.ranking && (
                            <div className="flex flex-wrap items-center gap-4 mt-6">
                                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 rounded-2xl border border-white/10 shadow-xl">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Rank</span>
                                    <span className="text-xl font-black text-white">#{profile.ranking.rank}</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 rounded-2xl border border-white/10 shadow-xl">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Score</span>
                                    <span className="text-xl font-black text-primary">{profile.ranking.score.toFixed(1)}</span>
                                </div>
                                <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 shadow-xl ${getTierStyle(profile.ranking.tier)}`}>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Global Tier</span>
                                    <span className="text-sm font-black uppercase tracking-tighter">{profile.ranking.tier}</span>
                                </div>
                            </div>
                        )}

                        {profile?.ranking && (
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <h4 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Global Score</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-black text-yellow-500">{profile.ranking.breakdown.dsa.toFixed(0)}</div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase">DSA</div>
                                    </div>
                                    <div className="text-center border-x border-white/10">
                                        <div className="text-2xl font-black text-blue-500">{profile.ranking.breakdown.cp.toFixed(0)}</div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase">CP</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-black text-purple-500">{profile.ranking.breakdown.github.toFixed(0)}</div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase">GitHub</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {message && (
                            <div className={`mt-4 p-4 rounded-xl text-center font-bold ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {message.text}
                            </div>
                        )}
                    </div>

                    {/* Projects Section */}
                    <div className="bg-zinc-900/50 p-6 md:p-8 rounded-[2.5rem] border border-white/10 flex flex-col text-center md:text-left">
                        <div className="flex justify-center md:justify-between items-center mb-6 relative">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                                Deployed Projects
                            </h3>
                            <button
                                onClick={() => {
                                    if (!isEditingProjects) setFormData(profile);
                                    setIsEditingProjects(!isEditingProjects);
                                }}
                                className={`p-2 rounded-full transition-colors absolute right-0 md:relative ${isEditingProjects ? 'bg-primary text-black' : 'bg-white/5 hover:bg-white/10 text-white'}`}
                                title={isEditingProjects ? 'Finish Editing' : 'Manage Projects'}
                            >
                                {isEditingProjects ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                )}
                            </button>
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                            {((isEditingProjects ? formData?.deployedProjects : profile?.deployedProjects) || []).map((proj, idx) => (
                                <ProjectItem
                                    key={`${proj.title}-${idx}`}
                                    proj={proj}
                                    idx={idx}
                                    isEditing={isEditingProjects}
                                    onRemove={removeProject}
                                />
                            ))}

                            {(!profile?.deployedProjects?.length && !isEditingProjects) && (
                                <div className="text-center py-12 text-gray-600">No projects added yet.</div>
                            )}
                        </div>

                        {isEditingProjects && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-widest">Add New Project</h4>
                                <div className="space-y-3">
                                    <input
                                        placeholder="Project Title"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-primary focus:outline-none"
                                        value={newProject.title}
                                        onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                                    />
                                    <input
                                        placeholder="Project URL (https://...)"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-primary focus:outline-none"
                                        value={newProject.url}
                                        onChange={e => setNewProject({ ...newProject, url: e.target.value })}
                                    />
                                    <textarea
                                        placeholder="Short Description"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-primary focus:outline-none resize-none h-20"
                                        value={newProject.description}
                                        onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                                    />
                                    <button
                                        onClick={addProject}
                                        className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_10px_rgba(22,163,74,0.3)] flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                                        Add Project
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (!user || !formData) return;
                                            setSaving(true);
                                            try {
                                                const uploadFormData = new FormData();
                                                (Object.keys(formData) as Array<keyof UserProfile>).forEach(key => {
                                                    if (key === 'ranking' || formData[key] === null) return;
                                                    if (key === 'deployedProjects') {
                                                        uploadFormData.append(key, JSON.stringify(formData[key]));
                                                    } else {
                                                        uploadFormData.append(key, formData[key] as string);
                                                    }
                                                });
                                                const updated = await apiClient.post('/profile/update', uploadFormData);
                                                setProfile({ ...updated, ranking: profile?.ranking });
                                                setIsEditingProjects(false);
                                                setMessage({ type: 'success', text: 'Projects updated!' });
                                            } catch (e) { console.error(e); } finally { setSaving(false); }
                                        }}
                                        disabled={saving}
                                        className="w-full py-3 bg-primary text-black rounded-xl font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                                    >
                                        {saving ? <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                                        Submit All Changes
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Internal Progress Stats (Read Only) */}
                <section>
                    <h3 className="text-2xl font-black mb-8">StacXar Progress</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* DSA Card */}
                        <div className="p-8 bg-zinc-900 rounded-[2.5rem] border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-32 bg-yellow-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-yellow-500/10 transition-colors duration-700"></div>
                            <h4 className="text-xl font-bold text-white mb-2">DSA Mastery</h4>
                            <div className="text-4xl font-black text-yellow-500 mb-4">{Object.values(dsaState).filter(st => st.mastery === 3).length} / 20</div>
                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(Object.values(dsaState).filter(st => st.mastery === 3).length / 20) * 100}%` }}
                                    className="bg-yellow-500 h-full"
                                ></motion.div>
                            </div>
                        </div>

                        {/* Web Dev Card */}
                        <div className="p-8 bg-zinc-900 rounded-[2.5rem] border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-700"></div>
                            <h4 className="text-xl font-bold text-white mb-2">Web Dev Checkpoints</h4>
                            <div className="text-4xl font-black text-blue-500 mb-4">{Object.values(webDevState).filter(st => st.mastery === 3).length} / 15</div>
                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(Object.values(webDevState).filter(st => st.mastery === 3).length / 15) * 100}%` }}
                                    className="bg-blue-500 h-full"
                                ></motion.div>
                            </div>
                        </div>

                        {/* App Dev Card */}
                        <div className="p-8 bg-zinc-900 rounded-[2.5rem] border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-primary/10 transition-colors duration-700"></div>
                            <h4 className="text-xl font-bold text-white mb-2">App Dev Mastery</h4>
                            <div className="text-4xl font-black text-primary mb-4">{Object.values(appDevState).filter(st => st.mastery === 3).length} / 15</div>
                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(Object.values(appDevState).filter(st => st.mastery === 3).length / 15) * 100}%` }}
                                    className="bg-primary h-full"
                                ></motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="block mt-8 text-center pb-8">

                </div>
            </main>
            <Footer />
        </div >
    );
};

export default Profile;
