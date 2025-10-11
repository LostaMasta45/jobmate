# 📸 VISUAL GUIDE - STORAGE POLICIES

## 🎯 POLICY 1: Allow Anonymous Upload

### **Form yang kamu lihat sekarang, isi seperti ini:**

---

### **1. Policy name** (kotak paling atas)
```
Allow anonymous upload
```

---

### **2. Allowed operation** (checkboxes)
✅ **CHECK: INSERT** (centang yang INSERT saja)
❌ Jangan centang: SELECT, UPDATE, DELETE

---

### **3. Target roles** (dropdown)
Click dropdown → Pilih: **`anon`**

(Jangan pilih "Defaults to all (public) roles")

---

### **4. Policy definition** (SQL code box)

SQL sudah auto-generate tapi mungkin salah. **HAPUS** semua yang ada, lalu **PASTE** ini:

```sql
(bucket_id = 'proofs')
```

**HANYA ITU SAJA!** Tidak perlu CREATE POLICY atau WITH CHECK, hanya kondisi di dalam kurung.

---

### **Screenshot Referensi:**

Seharusnya terlihat seperti ini setelah diisi:

```
Policy name:          Allow anonymous upload
Allowed operation:    ☑ INSERT (yang lain kosong)
Target roles:         anon
Policy definition:    (bucket_id = 'proofs')
```

---

### **5. Click "Review"** (button di bawah)

### **6. Click "Save policy"**

---

## ✅ DONE POLICY 1!

Sekarang buat **Policy 2**...

---

## 🎯 POLICY 2: Allow Admin View

### **1. Click "New Policy"** lagi (di bucket proofs)

### **2. Policy name**
```
Allow admin view
```

---

### **3. Allowed operation**
✅ **CHECK: SELECT** (centang yang SELECT saja)
❌ Jangan centang: INSERT, UPDATE, DELETE

---

### **4. Target roles**
Click dropdown → Pilih: **`authenticated`**

---

### **5. Policy definition**

**PASTE** ini:

```sql
(bucket_id = 'proofs' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
))
```

---

### **Screenshot Referensi:**

```
Policy name:          Allow admin view
Allowed operation:    ☑ SELECT (yang lain kosong)
Target roles:         authenticated
Policy definition:    (bucket_id = 'proofs' AND EXISTS (...))
```

---

### **6. Click "Review"**

### **7. Click "Save policy"**

---

## ✅ DONE BOTH POLICIES!

Sekarang lanjut **STEP 2** (create admin user)

---

## 🐛 TROUBLESHOOTING

### **"Cannot find bucket_id"**
→ Pastikan kamu sudah buat bucket "proofs" dulu

### **"Syntax error"**
→ Copy-paste **persis** dari guide ini, jangan edit

### **"Policy already exists"**
→ Hapus policy lama dulu, buat baru

---

## 📸 VISUAL CHECKLIST

After adding both policies, di bucket "proofs" → Policies tab:

✅ Should see 2 policies:
1. "Allow anonymous upload" - INSERT - anon
2. "Allow admin view" - SELECT - authenticated

---

**Next**: Create admin user (STEP 2)
