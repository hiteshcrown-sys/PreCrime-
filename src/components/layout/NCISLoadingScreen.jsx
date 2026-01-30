/**
 * Indian Government–style loading screen (auth/settings load).
 * Plain light background, logo first; no extra UI before logo.
 */
export default function NCISLoadingScreen() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-[9999]"
      style={{ background: "#f8fafc" }}
    >
      <div
        className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center shadow-sm"
        style={{ border: "3px solid #000080", background: "#fff" }}
      >
        <img
          src="/ncis-logo.png"
          alt="National Police"
          className="w-full h-full object-contain"
        />
      </div>
      <p className="mt-4 text-sm text-gray-500">Loading...</p>
    </div>
  );
}
