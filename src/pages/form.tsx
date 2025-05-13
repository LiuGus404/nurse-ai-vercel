export default function FormPage() {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">小測驗填寫區</h1>
        <p className="text-sm text-gray-600 mb-6">
          請協助填寫以下小測驗，
        </p>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSfxQtMDm7-ItDQYkjKlZ5AM7d19lbah2x8-KULy2a1mk4f5uw/viewform?embedded=true"
          width="100%"
          height="1800"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          title="Google Form"
          className="border rounded shadow"
        >
          Loading…
        </iframe>
      </div>
    );
  }