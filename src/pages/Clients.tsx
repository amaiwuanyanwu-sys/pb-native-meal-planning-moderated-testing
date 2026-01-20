import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlinePeople } from 'react-icons/md';
import { Sidebar } from '@/components/layout/Sidebar';
import { ClientListItem } from '@/components/clients/ClientListItem';
import { mockUsers } from '@/data/mockUsers';

const Clients: React.FC = () => {
  const navigate = useNavigate();

  const handleClientClick = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  return (
    <div className="flex h-screen bg-[#F8F9F9]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto p-8" style={{ maxWidth: '976px' }}>
            {/* Page Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex flex-1 items-center gap-2">
                <MdOutlinePeople className="text-[#385459] w-8 h-8" />
                <h1 className="text-2xl font-semibold text-[#01272E]">Clients</h1>
              </div>
            </div>

            {/* Clients List */}
            <div className="border border-[#DFE3E4] rounded overflow-hidden">
              {mockUsers.length > 0 ? (
                mockUsers.map((client) => (
                  <ClientListItem
                    key={client.id}
                    name={client.name}
                    email={client.email}
                    avatarInitials={client.initials}
                    avatarBgColor={client.avatarColor}
                    onClick={() => handleClientClick(client.id)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-6">
                  <div className="flex flex-col items-center gap-2 max-w-sm text-center">
                    <span className="material-icons text-[#96A5A8] text-5xl mb-2">person_outline</span>
                    <h3 className="text-base font-semibold text-[#244348]">No clients yet</h3>
                    <p className="text-sm font-medium text-[#657A7E]">
                      Add your first client to get started
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Clients;
