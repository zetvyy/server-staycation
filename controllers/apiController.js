const Travelers = require("../models/member");
const Treasure = require("../models/activity");
const Item = require("../models/item");
const Category = require("../models/category");
const Member = require("../models/member");
const Booking = require("../models/booking");

module.exports = {
  landingPage: async (req, res) => {
    try {
      const travelers = await Travelers.find();
      const treasure = await Treasure.find();
      const city = await Item.find();

      const mostPicked = await Item.find()
        .select("_id name type country city price")
        .limit(5)
        .populate({ path: "imageId", select: "_id imageUrl" });

      const categories = await Category.find()
        .select("_id name")
        .limit(3)
        .populate({
          path: "itemId",
          select: "_id name type country city isPopular imageId",
          perDocumentLimit: 4,
          option: {
            sort: { sumBooking: -1 },
          },
          populate: {
            path: "imageId",
            select: "_id imageUrl",
            perDocumentLimit: 1,
          },
        });

      for (let i = 0; i < categories.length; i++) {
        for (let j = 0; j < categories[i].itemId.length; j++) {
          const item = await Item.findOne({ _id: categories[i].itemId[j]._id });
          item.isPopular = false;
          await item.save();
          if (categories[i].itemId[0] === categories[i].itemId[j]) {
            item.isPopular = true;
            await item.save();
            if (categories[i].itemId[0] === categories[i].itemId[j]) {
              item.isPopular = true;
              await item.save();
            }
          }
        }
      }

      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "/images/testimonial-landingpages.jpg",
        name: "Happy Family",
        rate: 4.55,
        content:
          "What a great trip with my family and I should try again next time soon ...",
        familyName: "Angga",
        familyOccupation: "Product Designer",
      };

      res.status(200).json({
        hero: {
          travelers: travelers.length,
          treasure: treasure.length,
          city: city.length,
        },
        mostPicked,
        categories,
        testimonial,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  detailPage: async (req, res) => {
    const { id } = req.params;

    try {
      const item = await Item.findOne({ _id: id })
        .populate({ path: "featureId", select: "_id name qty imageUrl" })
        .populate({ path: "activityId", select: "_id name type imageUrl" })
        .populate({ path: "imageId", select: "_id imageUrl" });

      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "/images/testimonial-detailspage.jpg",
        name: "Happy Family",
        rate: 4.55,
        content:
          "What a great trip with my family and I should try again next time soon ...",
        familyName: "Angga",
        familyOccupation: "Product Designer",
      };

      res.status(200).json({
        ...item._doc,
        testimonial,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  bookingPage: async (req, res) => {
    const {
      itemId,
      duration,
      // price,
      bookingStartDate,
      bookingEndDate,
      firstName,
      lastName,
      email,
      phoneNumber,
      accountHolder,
      bankFrom,
    } = req.body;

    if (!req.file) {
      res.status(404).json({ message: "Image not found!" });
    } else if (
      (itemId === undefined,
      duration === undefined,
      // price === undefined,
      bookingStartDate === undefined,
      bookingEndDate === undefined,
      firstName === undefined,
      lastName === undefined,
      email === undefined,
      phoneNumber === undefined,
      accountHolder === undefined,
      bankFrom === undefined)
    ) {
      res.status(404).json({ message: "Field cannot be empty!" });
    } else {
      const item = await Item.findOne({ _id: itemId });

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      } else {
        item.sumBooking += 1;
        await item.save();

        let total = item.price * duration;
        let tax = total * 0.1;
        const invoice = Math.floor(1000000 * Math.random() * 9000000);

        const member = await Member.create({
          firstName,
          lastName,
          email,
          phoneNumber,
        });

        const newBooking = {
          invoice,
          bookingStartDate,
          bookingEndDate,
          total: (total += tax),
          itemId: {
            _id: item.id,
            title: item.title,
            price: item.price,
            duration: duration,
          },
          memberId: member.id,
          payments: {
            proofPayment: `images/${req.file.filename}`,
            bankFrom: bankFrom,
            accountHolder: accountHolder,
          },
        };

        const booking = await Booking.create(newBooking);

        res.status(201).json({ message: "Booking Succes!", booking });
      }
    }
  },
};
