const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");
const connectDB = require("./utilities/db");

const User = require("./models/userModel");
const Artwork = require("./models/artworkModel");
const Order = require("./models/orderModel");
const Category = require("./models/categoryModel");

dotenv.config({ path: path.join(__dirname, ".env") });

// Helper: load JSON files from /seed folder
const loadJSON = (fileName) => {
    const p = path.join(__dirname, "seed", fileName);
    return JSON.parse(fs.readFileSync(p, "utf8"));
};

const run = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("❌ Missing MONGO_URI in .env file");
            process.exit(1);
        }

        await connectDB();
        console.log("✅ Connected to MongoDB");

        // Load static JSON
        const artists = loadJSON("artists.json");
        const buyers = loadJSON("buyers.json");
        const artworks = loadJSON("artworks.json");
        const orders = loadJSON("orders.json");

        // Clear old data
        await User.deleteMany();
        await Artwork.deleteMany();
        await Order.deleteMany();
        await Category.deleteMany();
        console.log("🗑️ Cleared old data");

        // Insert users
        await User.insertMany([...artists, ...buyers]);
        console.log(`👤 Inserted ${artists.length + buyers.length} users`);

        // Insert artworks
        await Artwork.insertMany(artworks);
        console.log(`🎨 Inserted ${artworks.length} artworks`);

        // Insert orders
        await Order.insertMany(orders);
        console.log(`📦 Inserted ${orders.length} orders`);

        // Insert default categories
        const defaultCategories = [
            { name: 'Acrylic', slug: 'acrylic', iconName: 'PenTool', description: 'Acrylic fine art.' },
            { name: 'Digital', slug: 'digital', iconName: 'Film', description: 'Art created digitally using software.' },
            { name: 'Mixed Media', slug: 'mixed-media', iconName: 'Camera', description: 'Art created using a blend of multiple mediums.' },
            { name: 'Oil', slug: 'oil', iconName: 'Palette', description: 'Oil fine art.' },
            { name: 'Print', slug: 'print', iconName: 'ImgIcon', description: 'Photographic works and prints.' },
            { name: 'Watercolor', slug: 'watercolor', iconName: 'Palette', description: 'Watercolor fine art.' },
        ];

        await Category.insertMany(defaultCategories);
        console.log("📁 Inserted categories");

        // -----------------------------
        // 🚀 Identify Top Artist & Buyer
        // -----------------------------

        console.log("🏆 Calculating top artist & top buyer...");

        // Count artworks per artist
        const artworkCountMap = {};
        artworks.forEach(a => {
            const artistId = a.artist.toString();
            artworkCountMap[artistId] = (artworkCountMap[artistId] || 0) + 1;
        });

        // Count orders per artist
        const orderCountMap = {};
        orders.forEach(ord => {
            const seen = new Set();
            ord.items.forEach(item => {
                const artId = item.artwork.toString();
                const artDoc = artworks.find(a => a._id.toString() === artId);
                if (!artDoc) return;

                const artistId = artDoc.artist.toString();
                if (!seen.has(artistId)) {
                    orderCountMap[artistId] = (orderCountMap[artistId] || 0) + 1;
                    seen.add(artistId);
                }
            });
        });

        // Determine top artist
        let topArtistId = null;
        let topArtistScore = -1;

        artists.forEach(art => {
            const id = art._id.toString();
            const aCount = artworkCountMap[id] || 0;
            const oCount = orderCountMap[id] || 0;
            const score = aCount + oCount;

            if (score > topArtistScore) {
                topArtistScore = score;
                topArtistId = id;
            }
        });

        // Determine top buyer
        const buyerOrderCount = {};
        orders.forEach(ord => {
            const buyer = ord.buyer.toString();
            buyerOrderCount[buyer] = (buyerOrderCount[buyer] || 0) + 1;
        });

        let topBuyerId = null;
        let topBuyerScore = -1;

        buyers.forEach(b => {
            const id = b._id.toString();
            const count = buyerOrderCount[id] || 0;

            if (count > topBuyerScore) {
                topBuyerScore = count;
                topBuyerId = id;
            }
        });

        // Assign fixed passwords
        const TOP_ARTIST_PASS = "ArtistSeed!9999";
        const TOP_BUYER_PASS = "BuyerSeed!9999";

        if (topArtistId) {
            const hashed = await bcrypt.hash(TOP_ARTIST_PASS, 10);
            await User.findByIdAndUpdate(topArtistId, { password: hashed });

            const topArtistUser = artists.find(a => a._id === topArtistId);

            console.log("🏅 Top Artist Updated:");
            console.log(`   Email: ${topArtistUser.email}`);
            console.log(`   Password: ${TOP_ARTIST_PASS}`);
        }

        if (topBuyerId) {
            const hashed = await bcrypt.hash(TOP_BUYER_PASS, 10);
            await User.findByIdAndUpdate(topBuyerId, { password: hashed });

            const topBuyerUser = buyers.find(b => b._id === topBuyerId);

            console.log("💎 Top Buyer Updated:");
            console.log(`   Email: ${topBuyerUser.email}`);
            console.log(`   Password: ${TOP_BUYER_PASS}`);
        }

        console.log("🎉 Seeding complete!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Seeder Error:", err);
        process.exit(1);
    }
};

run();
