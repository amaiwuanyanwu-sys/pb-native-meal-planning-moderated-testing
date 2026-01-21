import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';

const Home: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#F8F9F9]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto" style={{ maxWidth: '976px' }}>
            <h1 className="text-[24px] font-semibold text-[#01272E] leading-tight mb-6">
              Home
            </h1>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-4">
              {/* Upcoming sessions */}
              <div className="bg-white rounded-lg border border-[#DFE3E4] overflow-hidden">
                {/* Widget Header */}
                <div className="bg-white border-b border-[#DFE3E4] h-14 px-4 flex items-center">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-[#657A7E] text-2xl">event</span>
                    <h2 className="text-sm font-semibold text-[#244348] leading-[1.4]">
                      Upcoming sessions
                    </h2>
                  </div>
                </div>

                {/* Widget Body - Empty State */}
                <div className="bg-white py-8 flex flex-col items-center justify-center">
                  <p className="text-sm text-[#657A7E]">No upcoming sessions</p>
                </div>
              </div>

              {/* Booking requests */}
              <div className="bg-white rounded-lg border border-[#DFE3E4] overflow-hidden">
                {/* Widget Header */}
                <div className="bg-white border-b border-[#DFE3E4] h-14 px-4 flex items-center">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-[#657A7E] text-2xl">calendar_month</span>
                    <h2 className="text-sm font-semibold text-[#244348] leading-[1.4]">
                      Booking requests
                    </h2>
                  </div>
                </div>

                {/* Widget Body - Empty State */}
                <div className="bg-white py-8 flex flex-col items-center justify-center">
                  <p className="text-sm text-[#657A7E]">No booking requests</p>
                </div>
              </div>

              {/* My tasks */}
              <div className="bg-white rounded-lg border border-[#DFE3E4] overflow-hidden">
                {/* Widget Header */}
                <div className="bg-white border-b border-[#DFE3E4] h-14 px-4 flex items-center">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-[#657A7E] text-2xl">check_circle</span>
                    <h2 className="text-sm font-semibold text-[#244348] leading-[1.4]">
                      My tasks
                    </h2>
                  </div>
                </div>

                {/* Widget Body - Empty State */}
                <div className="bg-white py-8 flex flex-col items-center justify-center">
                  <p className="text-sm text-[#657A7E]">No tasks</p>
                </div>
              </div>

              {/* Active programs */}
              <div className="bg-white rounded-lg border border-[#DFE3E4] overflow-hidden">
                {/* Widget Header */}
                <div className="bg-white border-b border-[#DFE3E4] h-14 px-4 flex items-center">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-[#657A7E] text-2xl">folder_open</span>
                    <h2 className="text-sm font-semibold text-[#244348] leading-[1.4]">
                      Active programs
                    </h2>
                  </div>
                </div>

                {/* Widget Body - Empty State */}
                <div className="bg-white py-8 flex flex-col items-center justify-center">
                  <p className="text-sm text-[#657A7E]">No active programs</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
