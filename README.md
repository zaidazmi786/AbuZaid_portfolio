# Abu Zaid – MERN Portfolio (Admin-only Project Manager)

Dark-purple portfolio: Hero, About, Skills, Projects, Contact.
**Sirf admin** projects add / edit / delete kar sakta hai (JWT login).
Project images **multer** se upload hoti hain (link ki zarurat nahi).

## Requirements
- Node.js 18+
- MongoDB (local ya MongoDB Atlas)

## Setup

### 1. Backend
```bash
cd server
npm install
npm run dev
```
`server/.env` pehle se bani hai (local MongoDB ke liye). Apne hisaab se badlo:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/portfolio
JWT_SECRET=<lamba random string>
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=Admin@12345
CLIENT_URL=http://localhost:5173
```
Pehli baar server chalne par is email/password se admin user apne aap ban jata hai.
**Deploy se pehle ADMIN_PASSWORD aur JWT_SECRET zaroor badlo.**

Resume wale 5 projects ek baar database me daalne ke liye (optional):
```bash
npm run seed
```
Phir admin panel se har project par **Edit** karke image upload kar do, aur Live/GitHub links daal do.

### 2. Frontend
```bash
cd client
npm install
cp .env.example .env     # Windows: copy .env.example .env
npm run dev
```
Open: http://localhost:5173

## Admin kaise use kare
1. Navbar me **Admin** par click karo (`/admin`) aur login karo.
2. Projects section me **+ Add Project**: title, description, **Upload image** (PC se), tech stack, links.
3. Har card par **Edit / Delete**. Edit me image change/remove kar sakte ho; delete par image file bhi server se hat jati hai.
4. Logout navbar se.

## Image upload (multer)
- Field name: `image`, formats: jpg, png, webp, gif, max 5MB.
- Files `server/uploads/` me save hoti hain aur `/uploads/<file>` se serve hoti hain.
- Deploy karte time dhyan do: Render/Heroku jaisi free hosting par disk reset ho jati hai, to uploaded images ud sakti hain. Wahan persistent disk lo ya Cloudinary use karo.

## Apni details badalna
`client/src/profile.js` me naam, about, skills, email, social links badlo.
Photo: `client/public/avatar.png`, Resume: `client/public/Abu_Zaid_Resume.pdf`.

## API
| Method | Route | Access |
|---|---|---|
| POST | /api/auth/login | public |
| GET | /api/projects | public |
| POST | /api/projects | admin (multipart) |
| PUT | /api/projects/:id | admin (multipart) |
| DELETE | /api/projects/:id | admin |

Admin check backend par JWT se hota hai, isliye sirf frontend buttons chhupane par nirbhar nahi hai.
