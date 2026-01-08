import { Loker } from "@/types/vip";

export const dummyLoker: Loker = {
    id: "design-mock-1",
    title: "Head Pastry Chef",
    perusahaan_name: "Athree Bakery",
    lokasi: "Jakarta Selatan",
    kategori: ["F&B", "Culinary", "Hospitality"],
    tipe_pekerjaan: "Full-time",
    gaji_min: 8000000,
    gaji_max: 15000000,
    gaji_text: "Rp 8 - 15 Juta",
    deskripsi: `Athree Bakery adalah artisan bakery premium yang menyajikan aneka roti dan pastry berkualitas tinggi dengan sentuhan modern. Kami mencari Head Pastry Chef yang kreatif dan berpengalaman untuk memimpin tim produksi kami.

Tanggung Jawab:
- Mengembangkan menu pastry dan bakery baru yang inovatif.
- Mengawasi operasional harian dapur produksi.
- Menjaga standar kualitas dan konsistensi produk.
- Melatih dan membimbing staf junior.
- Mengelola inventaris dan biaya bahan baku.

Tentang Kami:
Berdiri sejak 2018, Athree Bakery telah menjadi destinasi favorit pecinta roti di Jakarta. Kami percaya pada penggunaan bahan-bahan lokal terbaik dan teknik baking tradisional yang dipadukan dengan cita rasa kontemporer.`,
    kualifikasi: [
        "Pengalaman minimal 5 tahun di bidang pastry/bakery.",
        "Pernah menjabat sebagai Head Chef atau Sous Chef.",
        "Memiliki pengetahuan mendalam tentang teknik baking artisan.",
        "Mampu bekerja di bawah tekanan dan jadwal fleksibel.",
        "Passion yang kuat terhadap dunia kuliner."
    ],
    benefit: [
        "Gaji Kompetitif + Service Charge",
        "BPJS Kesehatan & Ketenagakerjaan",
        "Makan Gratis",
        "Bonus Tahunan",
        "Kesempatan Training Luar Negeri"
    ],
    deadline: "2025-12-31T00:00:00Z",
    status: "published",
    is_featured: true,
    view_count: 1250,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    poster_url: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=2080&auto=format&fit=crop",
    perusahaan: {
        id: "comp-athree",
        slug: "athree-bakery",
        name: "Athree Bakery",
        logo_url: "https://ui-avatars.com/api/?name=Athree+Bakery&background=d97706&color=fff&size=200",
        created_at: "",
        updated_at: ""
    },
    kontak_wa: "6281234567890",
    kontak_email: "hr@athreebakery.com",
    is_bookmarked: false
};

export const dummySimilar: Loker[] = [
    {
        id: "sim-1",
        title: "Product Designer",
        perusahaan_name: "Gojek",
        lokasi: "Jakarta",
        kategori: ["Design"],
        poster_url: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&auto=format&fit=crop&q=60",
        status: "published",
        is_featured: false,
        view_count: 0,
        created_at: "",
        updated_at: ""
    },
    {
        id: "sim-2",
        title: "UX Researcher",
        perusahaan_name: "Tokopedia",
        lokasi: "Remote",
        kategori: ["Research"],
        poster_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60",
        status: "published",
        is_featured: false,
        view_count: 0,
        created_at: "",
        updated_at: ""
    },
    {
        id: "sim-3",
        title: "Visual Designer",
        perusahaan_name: "Traveloka",
        lokasi: "Tangerang",
        kategori: ["Creative"],
        poster_url: "https://images.unsplash.com/photo-1626785774573-4b799314346d?w=800&auto=format&fit=crop&q=60",
        status: "published",
        is_featured: false,
        view_count: 0,
        created_at: "",
        updated_at: ""
    }
];
