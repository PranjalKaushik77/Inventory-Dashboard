"use client"

interface Product {
  name: string
  vendor: string
}

interface ProductListsProps {
  data: {
    overstocked: Product[]
    understocked: Product[]
    critical: Product[]
  }
}

export default function ProductLists({ data }: ProductListsProps) {
  // Function to send emails via Gmail compose window.
  const sendMails = (vendors: string[]) => {
    // Remove duplicates.
    const uniqueVendors = Array.from(new Set(vendors));
    // Build the Gmail compose URL using the BCC field (or 'to' field).
    // Gmail compose URL: https://mail.google.com/mail/?view=cm&fs=1&to=email1,email2,...
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(uniqueVendors.join(','))}`;
    // Open the Gmail compose window in a new tab.
    window.open(gmailComposeUrl, "_blank");
  };

  // The renderList function now includes a "Send Email" button.
  const renderList = (title: string, items: Product[], colorClass: string) => (
    <div className="card h-[400px] flex flex-col">
      <div className="card-body flex flex-col p-0">
        {/* Header area with title, badge, and Send Email button */}
        <div className={`px-6 py-4 rounded-t-xl ${colorClass}`}>
          <div className="flex items-center justify-between">
            <h2 className="card-title text-white m-0">{title}</h2>
            <span className="badge bg-white/20 text-white border-0">{items.length}</span>
          </div>
          <div className="mt-2">
          <button
                onClick={() => sendMails(items.map((item) => item.vendor))}
                className="btn btn-xs btn-outline btn-white px-3 py-1 rounded shadow hover:shadow-lg transition duration-150 bg-gray-700"
              >
                Send Email
              </button>

          </div>
        </div>
        {/* Scrollable list area */}
        <div className="overflow-y-auto h-[300px] p-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mb-2 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              <p>No items found</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item, index) => (
                <li
                  key={index}
                  className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200"
                >
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">{item.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <span className="font-medium">Vendor:</span> {item.vendor}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {renderList("Overstocked", data.overstocked, "bg-red-600 dark:bg-red-700")}
      {renderList("Understocked", data.understocked, "bg-yellow-500 dark:bg-yellow-600")}
      {renderList("Critical", data.critical, "bg-purple-600 dark:bg-purple-700")}
    </div>
  );
}
