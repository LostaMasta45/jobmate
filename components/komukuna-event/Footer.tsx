import Link from 'next/link';
import { Camera, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-black py-12 md:py-16 border-t border-white/10">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-4 gap-12 md:gap-8 mb-12">

                    <div className="md:col-span-1">
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-komukuna-pink to-komukuna-purple mb-4">
                            Komukuna Event
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            #MomenSempurna BersamaKomukuna. <br />
                            Kami membantu mengabadikan momen terindah Anda menjadi kenangan fisik dan digital yang abadi.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Layanan</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="#services" className="hover:text-komukuna-pink">Photobooth Unlimited</Link></li>
                            <li><Link href="#services" className="hover:text-komukuna-pink">Video Booth 360</Link></li>
                            <li><Link href="#usp" className="hover:text-komukuna-pink">Custom Template</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Kontak</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-center gap-2">
                                <Phone size={16} className="text-komukuna-pink" />
                                <a href="https://wa.me/6289676111118" target="_blank" className="hover:text-white">0896-7611-1118</a>
                            </li>
                            <li className="flex items-center gap-2"><Mail size={16} /> studio@komukuna.com</li>
                            <li className="flex items-center gap-2"><MapPin size={16} /> Jakarta, Indonesia</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Ikuti Kami</h4>
                        <div className="flex gap-4">
                            <Link href="https://instagram.com/komukunastudio" target="_blank" className="p-3 rounded-full bg-white/5 hover:bg-gradient-to-br hover:from-komukuna-pink hover:to-orange-500 hover:text-white transition-all group">
                                <Instagram size={20} className="text-gray-400 group-hover:text-white" />
                            </Link>
                            <Link href="#" className="p-3 rounded-full bg-white/5 hover:bg-komukuna-purple hover:text-white transition-all group">
                                <Camera size={20} className="text-gray-400 group-hover:text-white" />
                            </Link>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">@komukunastudio</p>
                    </div>

                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
                    <p>&copy; {new Date().getFullYear()} Komukuna Studio. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-gray-400">Kebijakan Privasi</Link>
                        <Link href="#" className="hover:text-gray-400">Syarat & Ketentuan</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
