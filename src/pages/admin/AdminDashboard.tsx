import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminCrudSection } from '../../components/AdminCrudSection/AdminCrudSection';
import { SocialLinksAdmin } from '../../components/SocialLinksAdmin/SocialLinksAdmin';
import { SponsorsAdmin } from '../../components/SponsorsAdmin/SponsorsAdmin';
import { FormSubmissionsAdmin } from '../../components/FormSubmissionsAdmin/FormSubmissionsAdmin';
import { Seo } from '../../components/Seo/Seo';
import { TABLE_LABELS, type TableName } from '../../types/content';
import './admin-shared.css';
import './AdminDashboard.css';

type DashboardTab = TableName | 'social' | 'sponsors' | 'forms';

const TABS: { key: DashboardTab; label: string }[] = [
  { key: 'courses', label: TABLE_LABELS.courses },
  { key: 'events', label: TABLE_LABELS.events },
  { key: 'news', label: TABLE_LABELS.news },
  { key: 'social', label: 'Redes Sociales' },
  { key: 'sponsors', label: 'Sponsors' },
  { key: 'forms', label: 'Formularios' },
];

const CONTENT_TABS: TableName[] = ['courses', 'events', 'news'];

function isContentTab(tab: DashboardTab): tab is TableName {
  return (CONTENT_TABS as DashboardTab[]).includes(tab);
}

export const AdminDashboard: React.FC = () => {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('courses');

  return (
    <div className="admin-page admin-dashboard">
      <Seo title="Panel de administración" noindex />
      <header className="admin-dashboard-header">
        <div>
          <h1 className="admin-dashboard-title">Panel Admin (demo)</h1>
          <p className="admin-dashboard-subtitle">Datos de ejemplo, no se guardan cambios reales.</p>
        </div>
        <button className="admin-btn admin-btn-secondary" onClick={() => signOut()}>Cerrar sesión</button>
      </header>

      <nav className="admin-dashboard-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`admin-dashboard-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="admin-dashboard-content">
        {activeTab === 'social' ? (
          <SocialLinksAdmin />
        ) : activeTab === 'sponsors' ? (
          <SponsorsAdmin />
        ) : activeTab === 'forms' ? (
          <FormSubmissionsAdmin />
        ) : isContentTab(activeTab) ? (
          <AdminCrudSection table={activeTab} label={TABLE_LABELS[activeTab]} />
        ) : null}
      </main>
    </div>
  );
};
