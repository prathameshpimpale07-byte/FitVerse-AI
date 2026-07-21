const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Trainer = require('./models/Trainer');
const User = require('./models/User'); // We might need to link them to users, or just leave user ref empty for now.

dotenv.config();

const trainersData = [
  {
    name: "Alex Mercer",
    email: "alex.mercer@fitverse.com",
    phone: "+1 555-0101",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg", // Male trainer
    specialization: ["Strength Training", "Bodybuilding"],
    experience: 8,
    bio: "Former competitive bodybuilder dedicated to helping clients achieve their ultimate physique through science-based strength training and nutrition.",
    rating: 4.9,
    totalReviews: 124,
    pricePerSession: 800,
    availability: [
      { day: "Mon", slots: ["06:00", "08:00", "16:00"] },
      { day: "Wed", slots: ["06:00", "08:00", "16:00"] },
      { day: "Fri", slots: ["06:00", "08:00", "16:00"] }
    ],
    certifications: ["NASM CPT", "ACE Fitness Nutrition"],
    isActive: true
  },
  {
    name: "Sarah Jenkins",
    email: "sarah.yoga@fitverse.com",
    phone: "+1 555-0102",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg", // Female yoga
    specialization: ["Yoga", "Rehabilitation Support"],
    experience: 5,
    bio: "Certified Yoga Alliance instructor focusing on mindfulness, flexibility, and holistic recovery. Perfect for beginners and advanced yogis alike.",
    rating: 4.8,
    totalReviews: 89,
    pricePerSession: 600,
    availability: [
      { day: "Tue", slots: ["07:00", "10:00", "17:00"] },
      { day: "Thu", slots: ["07:00", "10:00", "17:00"] },
      { day: "Sat", slots: ["08:00", "11:00"] }
    ],
    certifications: ["RYT 500", "Corrective Exercise Specialist"],
    isActive: true
  },
  {
    name: "Marcus Johnson",
    email: "marcus.j@fitverse.com",
    phone: "+1 555-0103",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg", // Male trainer 2
    specialization: ["HIIT", "Weight Loss"],
    experience: 6,
    bio: "High-energy coach who specializes in fat loss and metabolic conditioning. Get ready to sweat and see rapid transformations.",
    rating: 4.7,
    totalReviews: 210,
    pricePerSession: 500,
    availability: [
      { day: "Mon", slots: ["05:00", "09:00", "18:00"] },
      { day: "Wed", slots: ["05:00", "09:00", "18:00"] },
      { day: "Fri", slots: ["05:00", "09:00", "18:00"] }
    ],
    certifications: ["ISSA Personal Trainer", "CrossFit Level 1"],
    isActive: true
  },
  {
    name: "Elena Rodriguez",
    email: "elena.crossfit@fitverse.com",
    phone: "+1 555-0104",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg", // Female trainer
    specialization: ["CrossFit", "Strength Training"],
    experience: 7,
    bio: "Elite CrossFit competitor bringing intensity and precise technique coaching to help you master Olympic lifts and gymnastics.",
    rating: 4.9,
    totalReviews: 156,
    pricePerSession: 900,
    availability: [
      { day: "Tue", slots: ["16:00", "18:00", "20:00"] },
      { day: "Thu", slots: ["16:00", "18:00", "20:00"] },
      { day: "Sat", slots: ["09:00", "11:00"] }
    ],
    certifications: ["CrossFit Level 3", "USAW Level 1"],
    isActive: true
  },
  {
    name: "David Kim",
    email: "david.kim@fitverse.com",
    phone: "+1 555-0105",
    avatar: "https://randomuser.me/api/portraits/men/61.jpg", // Male trainer 3
    specialization: ["Bodybuilding", "Weight Loss"],
    experience: 10,
    bio: "Veteran coach with a decade of experience in body recomposition. I provide strict, tailored meal and workout plans.",
    rating: 4.6,
    totalReviews: 340,
    pricePerSession: 700,
    availability: [
      { day: "Mon", slots: ["07:00", "12:00", "17:00"] },
      { day: "Wed", slots: ["07:00", "12:00", "17:00"] },
      { day: "Fri", slots: ["07:00", "12:00", "17:00"] }
    ],
    certifications: ["NSCA CSCS", "Precision Nutrition Level 1"],
    isActive: true
  },
  {
    name: "Mia Thompson",
    email: "mia.t@fitverse.com",
    phone: "+1 555-0106",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg", // Female trainer
    specialization: ["Yoga", "HIIT"],
    experience: 4,
    bio: "Blending high-intensity cardio with restorative yoga for a perfectly balanced fitness routine.",
    rating: 4.8,
    totalReviews: 78,
    pricePerSession: 550,
    availability: [
      { day: "Tue", slots: ["06:00", "08:00", "18:00"] },
      { day: "Thu", slots: ["06:00", "08:00", "18:00"] }
    ],
    certifications: ["ACE Group Fitness", "RYT 200"],
    isActive: true
  },
  {
    name: "James Wilson",
    email: "james.rehab@fitverse.com",
    phone: "+1 555-0107",
    avatar: "https://randomuser.me/api/portraits/men/29.jpg", // Male trainer 4
    specialization: ["Rehabilitation Support", "Strength Training"],
    experience: 12,
    bio: "Specializing in post-injury recovery and functional movement. I help you get back to 100% safely and effectively.",
    rating: 5.0,
    totalReviews: 412,
    pricePerSession: 1200,
    availability: [
      { day: "Mon", slots: ["09:00", "11:00", "14:00"] },
      { day: "Wed", slots: ["09:00", "11:00", "14:00"] },
      { day: "Fri", slots: ["09:00", "11:00", "14:00"] }
    ],
    certifications: ["Doctor of Physical Therapy", "NSCA CSCS"],
    isActive: true
  },
  {
    name: "Sophia Chen",
    email: "sophia.chen@fitverse.com",
    phone: "+1 555-0108",
    avatar: "https://randomuser.me/api/portraits/women/31.jpg", // Female trainer
    specialization: ["Weight Loss", "Yoga"],
    experience: 3,
    bio: "Passionate about helping women build confidence through sustainable weight loss and mindful movement.",
    rating: 4.7,
    totalReviews: 56,
    pricePerSession: 450,
    availability: [
      { day: "Mon", slots: ["17:00", "18:00", "19:00"] },
      { day: "Wed", slots: ["17:00", "18:00", "19:00"] },
      { day: "Sat", slots: ["10:00", "11:00"] }
    ],
    certifications: ["NASM CPT"],
    isActive: true
  },
  {
    name: "Chris Evans",
    email: "chris.e@fitverse.com",
    phone: "+1 555-0109",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg", // Male trainer 5
    specialization: ["Bodybuilding", "CrossFit"],
    experience: 9,
    bio: "No-nonsense training approach. If you want to pack on muscle and build raw power, I am your guy.",
    rating: 4.8,
    totalReviews: 198,
    pricePerSession: 850,
    availability: [
      { day: "Tue", slots: ["05:00", "07:00", "16:00"] },
      { day: "Thu", slots: ["05:00", "07:00", "16:00"] },
      { day: "Sat", slots: ["06:00", "08:00"] }
    ],
    certifications: ["ISSA Master Trainer"],
    isActive: true
  },
  {
    name: "Aisha Patel",
    email: "aisha.p@fitverse.com",
    phone: "+1 555-0110",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg", // Female trainer
    specialization: ["HIIT", "Strength Training"],
    experience: 5,
    bio: "Dynamic and motivating coach specializing in circuit training and functional fitness to get you shredded fast.",
    rating: 4.9,
    totalReviews: 112,
    pricePerSession: 550,
    availability: [
      { day: "Mon", slots: ["18:00", "19:00", "20:00"] },
      { day: "Wed", slots: ["18:00", "19:00", "20:00"] },
      { day: "Fri", slots: ["18:00", "19:00", "20:00"] }
    ],
    certifications: ["ACE Personal Trainer", "Kettlebell Level 1"],
    isActive: true
  }
];

async function seedTrainers() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://prathameshpimpale07:xomgL6u8pS74C2X7@fitverse.b0vel6z.mongodb.net/fitverse?retryWrites=true&w=majority");
    console.log("Connected to MongoDB.");
    
    await Trainer.deleteMany({});
    console.log("Deleted old trainers.");

    await Trainer.insertMany(trainersData);
    console.log("Inserted 10 Professional Trainers!");
    
    mongoose.disconnect();
    console.log("Done.");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedTrainers();
