import React, { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Submitted:", formData);

    // Add your API call here
    // axios.post('/api/contact', formData)

    setFormData({
      email: "",
      subject: "",
      message: "",
    });
  };

return (
  <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-indigo-600/15 blur-[80px]" />
      <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-fuchsia-600/10 blur-[60px]" />
    </div>

    <div className="mx-auto max-w-3xl">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-violet-950/30 backdrop-blur-xl">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
            Contact Support
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-zinc-50">
            Get in Touch
          </h2>

          <p className="mt-4 text-zinc-400">
            Have a question, suggestion, or found a bug? We'd love to hear from
            you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Subject
            </label>

            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="How can we help?"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Message
            </label>

            <textarea
              name="message"
              rows="6"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us more..."
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/40"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 font-medium text-white transition hover:scale-[1.02] hover:from-violet-500 hover:to-indigo-500"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  </section>
);
};

export default ContactForm;
