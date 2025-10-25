// import React from 'react';
// import { Mail, Phone, Globe, MapPin, Linkedin, Twitter } from 'lucide-react';

// export default function BusinessCard() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-8">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl top-20 -left-20 animate-pulse"></div>
//         <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl bottom-20 -right-20 animate-pulse delay-1000"></div>
//       </div>

//       {/* Business Card Container */}
//       <div className="relative w-full max-w-4xl">
//         {/* Card Front */}
//         <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 transform transition-all duration-300 hover:scale-105">
//           <div className="flex flex-col md:flex-row gap-8">
//             {/* Left Section - Logo & Name */}
//             <div className="flex-1 flex flex-col justify-center items-center md:items-start space-y-6 border-b md:border-b-0 md:border-r border-white/20 pb-8 md:pb-0 md:pr-8">
//               {/* Logo */}
//               <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
//                 <span className="text-4xl font-bold text-white">TC</span>
//               </div>
              
//               {/* Business Name */}
//               <div className="text-center md:text-left">
//                 <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
//                   TechCraft
//                 </h1>
//                 <p className="text-white/80 text-lg font-light">
//                   Digital Solutions
//                 </p>
//               </div>

//               {/* Tagline */}
//               <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
//                 <p className="text-white/90 text-sm font-medium">
//                   Innovate • Create • Transform
//                 </p>
//               </div>
//             </div>

//             {/* Right Section - Contact Details */}
//             <div className="flex-1 flex flex-col justify-center space-y-6">
//               {/* Name & Title */}
//               <div className="mb-4">
//                 <h2 className="text-2xl font-bold text-white mb-1">
//                   Alex Johnson
//                 </h2>
//                 <p className="text-white/80 text-lg">
//                   Chief Executive Officer
//                 </p>
//               </div>

//               {/* Contact Information */}
//               <div className="space-y-4">
//                 <div className="flex items-center gap-3 group">
//                   <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
//                     <Phone className="w-5 h-5 text-white" />
//                   </div>
//                   <span className="text-white/90">+1 (555) 123-4567</span>
//                 </div>

//                 <div className="flex items-center gap-3 group">
//                   <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
//                     <Mail className="w-5 h-5 text-white" />
//                   </div>
//                   <span className="text-white/90">alex@techcraft.com</span>
//                 </div>

//                 <div className="flex items-center gap-3 group">
//                   <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
//                     <Globe className="w-5 h-5 text-white" />
//                   </div>
//                   <span className="text-white/90">www.techcraft.com</span>
//                 </div>

//                 <div className="flex items-center gap-3 group">
//                   <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
//                     <MapPin className="w-5 h-5 text-white" />
//                   </div>
//                   <span className="text-white/90">San Francisco, CA</span>
//                 </div>
//               </div>

//               {/* Social Links */}
//               <div className="flex gap-3 pt-4">
//                 <button className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all">
//                   <Linkedin className="w-5 h-5 text-white" />
//                 </button>
//                 <button className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all">
//                   <Twitter className="w-5 h-5 text-white" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Bottom Accent Line */}
//           <div className="mt-8 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"></div>
//         </div>
//       </div>
//     </div>
//   );
// }



import React from 'react';
import { Mail, Phone, Globe, MapPin, Linkedin, Twitter } from 'lucide-react';

export default function BusinessCard() {
	return (
		<div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
			
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -top-20 -left-24 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />
				<div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-300/10 blur-3xl" />
			</div>

			{/* Card Container */}
			<div className="relative w-full max-w-4xl">
				{/* Card */}
				<div className="bg-white/8 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-white/15 transition-transform duration-300 hover:-translate-y-0.5">
					<div className="flex flex-col md:flex-row gap-8 md:gap-10">
						{/* Left: Logo & Name */}
						<div className="flex-1 flex flex-col justify-center items-center md:items-start gap-6 md:gap-7 border-b md:border-b-0 md:border-r border-white/10 pb-8 md:pb-0 md:pr-10">
							{/* Logo */}
							<div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 backdrop-blur-lg shadow-inner flex items-center justify-center">
								<span className="text-3xl md:text-4xl font-semibold tracking-tight text-white/90">TC</span>
							</div>

							{/* Brand */}
							<div className="text-center md:text-left">
								<h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
									TechCraft
								</h1>
								<p className="text-slate-200/70 text-base md:text-lg">
									Digital Solutions
								</p>
							</div>

							{/* Tagline */}
							<div className="rounded-full px-4 py-1.5 bg-white/6 border border-white/15">
								<p className="text-slate-100/80 text-sm md:text-[15px]">
									Innovate • Create • Transform
								</p>
							</div>
						</div>

						{/* Right: Details */}
						<div className="flex-1 flex flex-col justify-center gap-6">
							{/* Name & Title */}
							<div>
								<h2 className="text-xl md:text-2xl font-semibold text-white">
									Alex Johnson
								</h2>
								<p className="text-slate-200/70 text-base">
									Chief Executive Officer
								</p>
							</div>

							{/* Contact */}
							<div className="space-y-3.5">
								<div className="flex items-center gap-3 group">
									<div className="w-9 h-9 rounded-lg bg-white/6 border border-white/15 backdrop-blur flex items-center justify-center group-hover:bg-white/10 transition-colors">
										<Phone className="w-4.5 h-4.5 text-white/90" />
									</div>
									<span className="text-slate-100/90 text-[15px]">
										+1 (555) 123-4567
									</span>
								</div>

								<div className="flex items-center gap-3 group">
									<div className="w-9 h-9 rounded-lg bg-white/6 border border-white/15 backdrop-blur flex items-center justify-center group-hover:bg-white/10 transition-colors">
										<Mail className="w-4.5 h-4.5 text-white/90" />
									</div>
									<a
										href="mailto:alex@techcraft.com"
										className="text-slate-100/90 text-[15px] underline decoration-white/20 underline-offset-4 hover:decoration-white/40 transition-colors"
									>
										alex@techcraft.com
									</a>
								</div>

								<div className="flex items-center gap-3 group">
									<div className="w-9 h-9 rounded-lg bg-white/6 border border-white/15 backdrop-blur flex items-center justify-center group-hover:bg-white/10 transition-colors">
										<Globe className="w-4.5 h-4.5 text-white/90" />
									</div>
									<a
										href="https://www.techcraft.com"
										target="_blank"
										rel="noopener noreferrer"
										className="text-slate-100/90 text-[15px] underline decoration-white/20 underline-offset-4 hover:decoration-white/40 transition-colors"
									>
										www.techcraft.com
									</a>
								</div>

								<div className="flex items-center gap-3 group">
									<div className="w-9 h-9 rounded-lg bg-white/6 border border-white/15 backdrop-blur flex items-center justify-center group-hover:bg-white/10 transition-colors">
										<MapPin className="w-4.5 h-4.5 text-white/90" />
									</div>
									<span className="text-slate-100/90 text-[15px]">
										San Francisco, CA
									</span>
								</div>
							</div>

							{/* Social */}
							<div className="flex gap-3 pt-2">
								<a
									href="https://www.linkedin.com"
									aria-label="LinkedIn"
									className="w-10 h-10 rounded-lg bg-white/6 border border-white/15 backdrop-blur flex items-center justify-center hover:bg-white/10 transition-colors"
								>
									<Linkedin className="w-5 h-5 text-white/90" />
								</a>
								<a
									href="https://twitter.com"
									aria-label="Twitter"
									className="w-10 h-10 rounded-lg bg-white/6 border border-white/15 backdrop-blur flex items-center justify-center hover:bg-white/10 transition-colors"
								>
									<Twitter className="w-5 h-5 text-white/90" />
								</a>
							</div>
						</div>
					</div>

					{/* Bottom accent */}
					<div className="mt-8 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-full" />
				</div>
			</div>
		</div>
	);
}