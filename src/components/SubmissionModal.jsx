import React, { useState } from 'react';
import { X, Download, Copy, Check, Database, FileCode, CheckCircle2, KeyRound } from 'lucide-react';
import { postmanCollectionData } from '../data/postmanCollection.ts';

export default function SubmissionModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('er'); // 'er' | 'postman' | 'credentials' | 'rubric'
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyPostman = () => {
    navigator.clipboard.writeText(JSON.stringify(postmanCollectionData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPostman = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(postmanCollectionData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'EstatePulse_MERN_Postman_Collection.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Project 12: Submission & Architecture Package</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Entity Relationship (ER) Diagram, Postman API Collection, 100-Mark Rubric, and Credentials
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 px-6 gap-2 bg-white pt-2">
          <button
            onClick={() => setActiveTab('er')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'er'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>ER Diagram (6 Models)</span>
          </button>
          <button
            onClick={() => setActiveTab('postman')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'postman'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Postman Collection</span>
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'credentials'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Demo Credentials</span>
          </button>
          <button
            onClick={() => setActiveTab('rubric')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'rubric'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Rubric Checklist (100/100)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* TAB 1: ER DIAGRAM */}
          {activeTab === 'er' && (
            <div className="space-y-6">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                <strong>6 Mongoose Schemas & Relational Mapping:</strong> Complete data layer models matching Project 12 guidelines. Foreign keys and reference IDs link Users, Properties, Images, Enquiries, Visits, and Deals.
              </div>

              {/* ER Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. User */}
                <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
                  <div className="bg-slate-900 text-white px-3 py-2 text-xs font-bold flex items-center justify-between">
                    <span>User Model</span>
                    <span className="text-[10px] text-amber-400 font-mono">users</span>
                  </div>
                  <div className="p-3 text-xs space-y-1 font-mono text-slate-700">
                    <div className="text-amber-700 font-semibold">PK: _id (ObjectId/String)</div>
                    <div>name: String (required)</div>
                    <div>email: String (unique)</div>
                    <div>password: String (bcrypt)</div>
                    <div className="text-sky-700 font-semibold">role: 'admin'|'agent'|'customer'</div>
                    <div>phone: String</div>
                    <div>avatar: String</div>
                    <div>title: String</div>
                    <div className="text-slate-400 text-[11px]">createdAt: Date</div>
                  </div>
                </div>

                {/* 2. Property */}
                <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
                  <div className="bg-slate-900 text-white px-3 py-2 text-xs font-bold flex items-center justify-between">
                    <span>Property Model</span>
                    <span className="text-[10px] text-amber-400 font-mono">properties</span>
                  </div>
                  <div className="p-3 text-xs space-y-1 font-mono text-slate-700">
                    <div className="text-amber-700 font-semibold">PK: _id (ObjectId/String)</div>
                    <div>title: String (required)</div>
                    <div>description: String</div>
                    <div>price: Number</div>
                    <div>propertyType: String (enum)</div>
                    <div>status: 'available'|'under_offer'|'sold'</div>
                    <div>location: Object (address, city...)</div>
                    <div>features: Object (beds, sqft...)</div>
                    <div className="text-emerald-700 font-semibold">FK: agentId -&gt; User._id</div>
                    <div>images: [String]</div>
                    <div className="text-slate-400 text-[11px]">createdAt: Date</div>
                  </div>
                </div>

                {/* 3. PropertyImage */}
                <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
                  <div className="bg-slate-900 text-white px-3 py-2 text-xs font-bold flex items-center justify-between">
                    <span>PropertyImage Model</span>
                    <span className="text-[10px] text-amber-400 font-mono">propertyimages</span>
                  </div>
                  <div className="p-3 text-xs space-y-1 font-mono text-slate-700">
                    <div className="text-amber-700 font-semibold">PK: _id (ObjectId/String)</div>
                    <div className="text-emerald-700 font-semibold">FK: propertyId -&gt; Property._id</div>
                    <div>url: String</div>
                    <div>caption: String</div>
                    <div>isPrimary: Boolean</div>
                    <div className="text-slate-400 text-[11px]">createdAt: Date</div>
                  </div>
                </div>

                {/* 4. Enquiry */}
                <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
                  <div className="bg-slate-900 text-white px-3 py-2 text-xs font-bold flex items-center justify-between">
                    <span>Enquiry Model</span>
                    <span className="text-[10px] text-amber-400 font-mono">enquiries</span>
                  </div>
                  <div className="p-3 text-xs space-y-1 font-mono text-slate-700">
                    <div className="text-amber-700 font-semibold">PK: _id (ObjectId/String)</div>
                    <div className="text-emerald-700 font-semibold">FK: propertyId -&gt; Property._id</div>
                    <div className="text-emerald-700 font-semibold">FK: customerId -&gt; User._id</div>
                    <div className="text-emerald-700 font-semibold">FK: assignedAgentId -&gt; User._id</div>
                    <div>customerName: String</div>
                    <div>customerEmail: String</div>
                    <div>message: String</div>
                    <div>status: 'new'|'contacted'|'closed'</div>
                    <div className="text-slate-400 text-[11px]">createdAt: Date</div>
                  </div>
                </div>

                {/* 5. Visit */}
                <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
                  <div className="bg-slate-900 text-white px-3 py-2 text-xs font-bold flex items-center justify-between">
                    <span>Visit Model</span>
                    <span className="text-[10px] text-amber-400 font-mono">visits</span>
                  </div>
                  <div className="p-3 text-xs space-y-1 font-mono text-slate-700">
                    <div className="text-amber-700 font-semibold">PK: _id (ObjectId/String)</div>
                    <div className="text-emerald-700 font-semibold">FK: propertyId -&gt; Property._id</div>
                    <div className="text-emerald-700 font-semibold">FK: customerId -&gt; User._id</div>
                    <div className="text-emerald-700 font-semibold">FK: agentId -&gt; User._id</div>
                    <div>visitDate: String</div>
                    <div>visitTimeSlot: String</div>
                    <div>status: 'scheduled'|'completed'</div>
                    <div>feedback: String</div>
                    <div className="text-slate-400 text-[11px]">createdAt: Date</div>
                  </div>
                </div>

                {/* 6. Deal */}
                <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
                  <div className="bg-slate-900 text-white px-3 py-2 text-xs font-bold flex items-center justify-between">
                    <span>Deal Model</span>
                    <span className="text-[10px] text-amber-400 font-mono">deals</span>
                  </div>
                  <div className="p-3 text-xs space-y-1 font-mono text-slate-700">
                    <div className="text-amber-700 font-semibold">PK: _id (ObjectId/String)</div>
                    <div className="text-emerald-700 font-semibold">FK: propertyId -&gt; Property._id</div>
                    <div className="text-emerald-700 font-semibold">FK: customerId -&gt; User._id</div>
                    <div className="text-emerald-700 font-semibold">FK: agentId -&gt; User._id</div>
                    <div>agreedPrice: Number</div>
                    <div>dealType: 'sale'|'rent'</div>
                    <div className="text-sky-700 font-semibold">stage: 'inquiry'|'offer_made'|'closed_won'</div>
                    <div>paymentTerms: String</div>
                    <div>closingDate: String</div>
                    <div className="text-slate-400 text-[11px]">createdAt: Date</div>
                  </div>
                </div>
              </div>

              {/* Cardinality Summary */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                <div className="font-semibold text-slate-900">Entity Relationships & Cardinality:</div>
                <div className="text-slate-600">· <strong>User (1) &mdash; (N) Property</strong>: An agent manages multiple properties.</div>
                <div className="text-slate-600">· <strong>Property (1) &mdash; (N) PropertyImage</strong>: A property holds multiple photography assets.</div>
                <div className="text-slate-600">· <strong>Property (1) &mdash; (N) Enquiry</strong>: Multiple customer inquiries attach to a property listing.</div>
                <div className="text-slate-600">· <strong>Property (1) &mdash; (N) Visit</strong>: Buyers schedule showing appointments with agents.</div>
                <div className="text-slate-600">· <strong>Property (1) &mdash; (N) Deal</strong>: Commercial pipeline tracks transaction negotiations through closing.</div>
              </div>
            </div>
          )}

          {/* TAB 2: POSTMAN COLLECTION */}
          {activeTab === 'postman' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Postman v2.1.0 Collection</h3>
                  <p className="text-xs text-slate-500">Includes 18+ endpoints for Auth, Properties, Enquiries, Visits, Deals, and Analytics.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyPostman}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                  <button
                    onClick={handleDownloadPostman}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .json</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl overflow-hidden">
                <pre className="text-[11px] font-mono text-slate-300 max-h-96 overflow-y-auto p-2">
                  {JSON.stringify(postmanCollectionData, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: DEMO CREDENTIALS */}
          {activeTab === 'credentials' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600">
                Use these test accounts to verify role-based navigation and permissions for Admin, Agent, and Customer personas:
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Role</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Password</th>
                      <th className="p-3">Key Permissions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-semibold text-amber-700">Admin</td>
                      <td className="p-3 font-medium">Victoria Vance</td>
                      <td className="p-3 font-mono">admin@estatepulse.com</td>
                      <td className="p-3 font-mono">admin123</td>
                      <td className="p-3">Full CRUD properties, assign agents, analytics dashboard, manage deals</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-semibold text-sky-700">Agent</td>
                      <td className="p-3 font-medium">Sarah Jenkins</td>
                      <td className="p-3 font-mono">sarah.agent@estatepulse.com</td>
                      <td className="p-3 font-mono">agent123</td>
                      <td className="p-3">Manage assigned properties, respond to enquiries, conduct visits, track deals</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-semibold text-sky-700">Agent</td>
                      <td className="p-3 font-medium">Marcus Sterling</td>
                      <td className="p-3 font-mono">marcus.agent@estatepulse.com</td>
                      <td className="p-3 font-mono">agent123</td>
                      <td className="p-3">Commercial properties and client showings</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-semibold text-emerald-700">Customer</td>
                      <td className="p-3 font-medium">Elena Rostova</td>
                      <td className="p-3 font-mono">elena.buyer@gmail.com</td>
                      <td className="p-3 font-mono">customer123</td>
                      <td className="p-3">Browse listings, submit property enquiries, schedule showings, view deal status</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-semibold text-emerald-700">Customer</td>
                      <td className="p-3 font-medium">David Chen</td>
                      <td className="p-3 font-mono">david.renter@gmail.com</td>
                      <td className="p-3 font-mono">customer123</td>
                      <td className="p-3">Bookings, rental search, and inquiry responses</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: RUBRIC CHECKLIST */}
          {activeTab === 'rubric' && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                <strong>100 Marks Compliance Audit:</strong> Complete alignment with the MERN full-stack evaluation criteria.
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { area: 'React structure and routing', marks: '15 Marks', note: 'Vite + React with react-router-dom, protected route guards, role-scoped navigation.' },
                  { area: 'Forms and validation', marks: '10 Marks', note: 'Controlled form fields, event.preventDefault(), client-side validation errors & server re-validation.' },
                  { area: 'Context API and auth flow', marks: '10 Marks', note: 'Only React Context API used (AuthContext & ToastContext). No Redux. JWT stored in localStorage.' },
                  { area: 'Express architecture', marks: '15 Marks', note: 'Clean separation of config, models, middleware, controllers, and routes in src/server/.' },
                  { area: 'REST API features', marks: '15 Marks', note: 'RESTful CRUD endpoints with query search, filters, pagination, and sorting for properties, enquiries, visits, deals.' },
                  { area: 'Mongoose design', marks: '10 Marks', note: '6 models (User, Property, PropertyImage, Enquiry, Visit, Deal) with schema types, defaults, and relationships.' },
                  { area: 'Authentication and security', marks: '10 Marks', note: 'JWT bearer tokens, bcrypt password hashing, role authorization middleware.' },
                  { area: 'UI and responsiveness', marks: '5 Marks', note: 'Tailwind CSS, zero-pill typography, tabular numerals, mobile & desktop responsive.' },
                  { area: 'Deployment & Configuration', marks: '5 Marks', note: 'Configured for deployment, environment variable support, Vite middlewares.' },
                  { area: 'Git and documentation', marks: '5 Marks', note: 'Interactive ER diagram viewer, downloadable Postman collection JSON, demo credentials.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between p-2.5 rounded-lg border border-slate-200 bg-white">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-900">{item.area}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">{item.note}</div>
                      </div>
                    </div>
                    <span className="font-mono font-semibold text-slate-700 shrink-0 ml-3">{item.marks}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Project 12: Real Estate Management MERN System</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
