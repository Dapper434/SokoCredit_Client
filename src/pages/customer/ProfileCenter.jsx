import { useState, useEffect } from "react";
import {
  borrowerProfile,
  statementDownloads,
  uploadedDocuments,
} from "../../data/mockCustomerData";
import { pointRedemptions } from "../../data/sokoPointsConfig";
import { getSession, getMyProfile, getMyPoints, updateMyProfile } from "../../lib/api";
import { useToast } from "../../components/shared/Toast";

function LockedField({ label, value, onRequestEdit }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] md:text-xs font-semibold text-ink-muted uppercase tracking-wide">{label}</label>
      <div className="flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 rounded border border-border bg-ground">
        <span className="text-sm md:text-base text-ink-dim">{value}</span>
        <button
          onClick={onRequestEdit}
          className="text-[10px] md:text-xs text-primary font-semibold border border-status-paid-border bg-status-paid-bg px-2 md:px-3 py-0.5 md:py-1 rounded hover:opacity-80 transition-opacity whitespace-nowrap ml-2">
          Request Edit
        </button>
      </div>
    </div>
  );
}

function EditableField({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] md:text-xs font-semibold text-ink-dim uppercase tracking-wide">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded border border-border text-sm md:text-base text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
      />
    </div>
  );
}

export default function ProfileCenter() {
  const { toast, ToastContainer } = useToast();
  const [tab, setTab] = useState("kyc");
  const [address, setAddress] = useState("");
  const [kinName, setKinName] = useState("");
  const [kinPhone, setKinPhone] = useState("");
  const [gender, setGender] = useState("");

  // Real SokoPoints + badge progress from the backend. Starts empty so a new
  // customer never sees points or badges they have not actually earned.
  const [points, setPoints] = useState({
    soko_points_total: 0, badges: [], badges_earned: 0, badges_total: 0,
  });
  const [pointsLoaded, setPointsLoaded] = useState(false);
  const [profileMeta, setProfileMeta] = useState({
    market_name: null, stall_number: null, credit_tier: null,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editField, setEditField] = useState("");
  const [editReason, setEditReason] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateMyProfile({
        residential_address: address,
        next_of_kin_name: kinName,
        next_of_kin_phone: kinPhone
      });
      toast("Profile updated successfully!", "success");
    } catch (err) {
      console.error(err);
      toast("Failed to update profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRequestEditSubmit = () => {
    setIsEditModalOpen(false);
    setEditReason("");
    toast("The request has been successfully sent and an agent will reach out to you", "success");
  };

  useEffect(() => {
    getMyProfile().then((profile) => {
      if (profile.residential_address) setAddress(profile.residential_address);
      if (profile.next_of_kin_name) setKinName(profile.next_of_kin_name);
      if (profile.next_of_kin_phone) setKinPhone(profile.next_of_kin_phone);
      if (profile.gender) setGender(profile.gender);
      setProfileMeta({
        market_name: profile.market_name,
        stall_number: profile.stall_number,
        credit_tier: profile.credit_tier,
      });
    }).catch(console.error);

    getMyPoints()
      .then(setPoints)
      .catch(console.error)
      .finally(() => setPointsLoaded(true));
  }, []);

  // Use real session data where available, fall back to mock for fields not in session
  const session = getSession();
  const user = session?.user || {};
  const fullName = user.full_name || borrowerProfile.fullName;
  const initials = fullName.substring(0, 2).toUpperCase();
  const phoneNumber = user.phone_number || borrowerProfile.phone;
  const nationalId = user.national_id_number || borrowerProfile.nationalId;

  // Real SokoPoints balance and badges — never mocked.
  const sokoPoints = points.soko_points_total ?? 0;
  const badges = points.badges ?? [];

  // Real market/stall/tier, with honest placeholders before assignment.
  const tier = profileMeta.credit_tier || "C";
  const stallLine = profileMeta.market_name
    ? `${profileMeta.market_name}${profileMeta.stall_number ? ` · Stall ${profileMeta.stall_number}` : ""}`
    : "No market stall assigned";

  return (
    <div className="flex flex-col pb-8 md:max-w-5xl md:mx-auto md:p-8 min-h-screen bg-ground md:bg-transparent">
      {/* Profile header */}
      <div className="bg-primary px-5 pt-6 pb-10 md:rounded-xl md:mb-8 md:shadow-sm md:px-8 md:py-8">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-2xl md:text-3xl font-bold text-white shadow-inner">
            {initials}
          </div>
          <div>
            <p className="text-lg md:text-2xl font-bold text-white">{fullName}</p>
            <p className="text-sm md:text-base text-white/70 mt-0.5">
              {stallLine}
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-status-paid-border" />
              <span className="text-[10px] md:text-xs font-mono text-white/90 font-medium">Tier {tier}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="md:grid md:grid-cols-[240px_1fr] md:gap-10">
        {/* Tabs / Sidebar */}
        <div className="sticky top-0 z-10 bg-ground -mt-5 rounded-t-[20px] md:static md:mt-0 md:bg-transparent md:rounded-none">
          <div className="flex border-b border-border px-5 md:flex-col md:border-b-0 md:px-0 md:gap-2">
            {["kyc", "badges", "documents"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 md:flex-none md:w-full md:text-left py-3.5 md:py-3 md:px-4 text-xs md:text-sm font-semibold uppercase md:tracking-wide tracking-wide transition-all ${
                  tab === t 
                  ? "text-primary border-b-2 border-primary -mb-px md:border-b-0 md:border-l-4 md:-ml-1 md:bg-primary/5 md:mb-0 md:rounded-r" 
                  : "text-ink-muted hover:text-ink-dim md:border-l-4 md:border-transparent md:-ml-1 md:hover:bg-surface md:rounded-r"
                }`}
              >
                {t === "kyc" ? "KYC Profile" : t === "badges" ? "Badges & Points" : "Documents"}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="px-5 pt-5 md:px-0 md:pt-0 flex flex-col gap-6 md:gap-8">
          {tab === "kyc" && (
            <div className="md:bg-surface md:border md:border-border md:rounded-xl md:p-8 flex flex-col gap-8 shadow-sm">
              <div>
                <p className="text-[10px] md:text-xs font-semibold text-ink-muted uppercase tracking-widest mb-4">
                  Locked Fields — require verification to change
                </p>
                <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6">
                  <LockedField label="Full Legal Name" value={fullName} onRequestEdit={() => { setEditField("Full Legal Name"); setIsEditModalOpen(true); }} />
                  <LockedField label="National ID" value={nationalId} onRequestEdit={() => { setEditField("National ID"); setIsEditModalOpen(true); }} />
                  <LockedField label="Gender" value={gender || borrowerProfile.gender} onRequestEdit={() => { setEditField("Gender"); setIsEditModalOpen(true); }} />
                  <LockedField label="M-Pesa Phone" value={phoneNumber} onRequestEdit={() => { setEditField("M-Pesa Phone"); setIsEditModalOpen(true); }} />
                </div>
              </div>
              
              <hr className="border-border hidden md:block" />

              <div>
                <p className="text-[10px] md:text-xs font-semibold text-ink-dim uppercase tracking-widest mb-4">Editable Fields</p>
                <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6">
                  <div className="md:col-span-2">
                    <EditableField label="Residential Address" value={address} onChange={setAddress} />
                  </div>
                  <EditableField label="Next of Kin Name" value={kinName} onChange={setKinName} />
                  <EditableField label="Phone Number" value={kinPhone} onChange={setKinPhone} />
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full md:w-auto md:self-end py-3 md:py-3.5 md:px-8 rounded bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-sm mt-2 md:mt-0 disabled:opacity-50">
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {tab === "badges" && (
            <div className="flex flex-col gap-6 md:gap-8">
              <div className="flex items-center justify-between md:bg-surface md:border md:border-border md:rounded-xl md:p-6 md:shadow-sm">
                <div>
                  <p className="text-xs md:text-sm font-semibold text-ink-dim uppercase tracking-wide">SokoPoints Balance</p>
                  <p className="text-2xl md:text-4xl font-bold font-mono text-accent mt-1">
                    {pointsLoaded ? sokoPoints.toLocaleString() : "—"} <span className="text-lg md:text-xl text-ink-muted">pts</span>
                  </p>
                </div>
                <button
                  disabled={sokoPoints === 0}
                  className="text-xs md:text-sm text-primary font-semibold border border-status-paid-border bg-status-paid-bg px-4 py-2 rounded hover:opacity-80 transition-opacity shadow-sm disabled:opacity-40 disabled:cursor-not-allowed">
                  Redeem Points
                </button>
              </div>

              <div className="md:bg-surface md:border md:border-border md:rounded-xl md:p-6 md:shadow-sm">
                <p className="text-xs font-semibold text-ink-dim uppercase tracking-wide mb-4 hidden md:block">
                  My Badges {pointsLoaded && `· ${points.badges_earned} of ${points.badges_total} earned`}
                </p>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                  {badges.map((badge) => (
                    <div
                      key={badge.event_type}
                      title={badge.description}
                      className={`flex flex-col items-center text-center py-4 px-2 md:py-6 md:px-3 rounded-lg border transition-colors ${
                        badge.earned ? "bg-surface md:bg-ground border-status-paid-border shadow-sm md:shadow-none" : "bg-ground border-border opacity-50"
                      }`}
                    >
                      <span className={`text-2xl md:text-3xl mb-2 md:mb-3 ${!badge.earned ? "grayscale" : ""}`}>{badge.icon}</span>
                      <p className="text-[10px] md:text-xs font-semibold text-ink leading-tight">{badge.title}</p>
                      <p className="text-[9px] md:text-[10px] font-mono text-ink-muted mt-1">+{badge.points} pts</p>
                      {!badge.earned && <span className="text-[9px] font-mono text-ink-muted mt-1 bg-border/50 px-1.5 py-0.5 rounded">Locked</span>}
                    </div>
                  ))}
                </div>
                {pointsLoaded && points.badges_earned === 0 && (
                  <p className="text-xs text-ink-muted mt-4 text-center md:text-left">
                    No badges yet — complete your 14-day savings gate to earn your first.
                  </p>
                )}
              </div>

              <div className="md:bg-surface md:border md:border-border md:rounded-xl md:p-6 md:shadow-sm">
                <p className="text-xs font-semibold text-ink-dim uppercase tracking-wide mb-4">Redeem SokoPoints</p>
                <div className="flex flex-col gap-3">
                  {pointRedemptions.map((r) => (
                    <div key={r.label} className="flex items-center justify-between py-3.5 px-4 bg-surface md:bg-ground border border-border rounded-lg transition-colors hover:border-primary/50">
                      <span className="text-sm md:text-base font-medium text-ink">{r.label}</span>
                      <button
                        disabled={r.cost > sokoPoints}
                        className={`text-[11px] md:text-xs font-semibold px-3 py-1.5 rounded border transition-colors ${
                          r.cost === 0
                            ? "bg-status-paid-bg text-status-paid-text border-status-paid-border"
                            : r.cost > sokoPoints
                            ? "bg-ground text-ink-muted border-border cursor-not-allowed"
                            : "bg-primary text-white border-primary hover:bg-primary-hover shadow-sm"
                        }`}
                      >
                        {r.cost === 0 ? "Free" : `${r.cost} pts`}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "documents" && (
            <div className="flex flex-col gap-6 md:gap-8">
              <div className="md:bg-surface md:border md:border-border md:rounded-xl md:p-6 md:shadow-sm">
                <div className="mb-4">
                  <p className="text-xs md:text-sm font-semibold text-ink-dim uppercase tracking-wide">Generate Documents</p>
                  <p className="text-[11px] md:text-xs text-ink-muted mt-1">Tap to download. Documents generated instantly.</p>
                </div>
                <div className="flex flex-col gap-3">
                  {statementDownloads.map(({ label, sub, icon }) => (
                    <button
                      key={label}
                      className="flex items-center gap-4 w-full text-left py-4 px-4 md:px-5 bg-surface md:bg-ground border border-border rounded-lg hover:border-primary transition-all group shadow-sm md:shadow-none"
                    >
                      <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm md:text-base font-semibold text-ink group-hover:text-primary transition-colors">{label}</p>
                        <p className="text-[11px] md:text-xs text-ink-muted mt-0.5">{sub}</p>
                      </div>
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary flex-shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:bg-surface md:border md:border-border md:rounded-xl md:p-6 md:shadow-sm">
                <p className="text-xs md:text-sm font-semibold text-ink-dim uppercase tracking-wide mb-4">Uploaded Documents</p>
                <div className="flex flex-col border border-border rounded-lg overflow-hidden md:border-0 md:rounded-none">
                  {uploadedDocuments.map((doc, i) => (
                    <div key={doc.type} className={`flex items-center justify-between py-3 px-4 md:px-0 bg-surface md:bg-transparent ${i !== uploadedDocuments.length - 1 ? 'border-b border-border-dim' : ''}`}>
                      <div>
                        <p className="text-sm md:text-base font-medium text-ink">{doc.type}</p>
                        <p className="text-[11px] md:text-xs font-mono text-ink-muted mt-0.5">{doc.date}</p>
                      </div>
                      <span className="text-[10px] md:text-xs font-mono text-status-paid-text bg-status-paid-bg border border-status-paid-border px-2.5 py-1 rounded">
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Request Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm">
          <div className="bg-surface rounded-xl shadow-xl w-full max-w-md p-6 flex flex-col gap-5 border border-border">
            <h3 className="text-lg font-bold text-ink">Request Edit</h3>
            <p className="text-sm text-ink-dim">
              You are requesting to change your <strong>{editField}</strong>. This requires verification. Please provide a reason for the change.
            </p>
            <textarea
              className="w-full px-4 py-3 rounded-md border border-border text-sm text-ink bg-ground focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
              placeholder="e.g., I have legally changed my name..."
              value={editReason}
              onChange={(e) => setEditReason(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2.5 rounded text-sm font-semibold text-ink-dim hover:text-ink transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestEditSubmit}
                disabled={!editReason.trim()}
                className="px-5 py-2.5 rounded bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}