import StudentReservation from "../model/StudentReservation.js";
import Hostel from "../model/Hostel.js";
import User from "../model/User.js";
import studentcomplaint from "./studentcomplaint.js";
import StudentReg from "../model/StudentReg.js";
import messages from "../constants/message.js";
import Room from "../model/Room.js"


const add = async (req, res) => {
    console.log("In  StudentReservation controller");
    console.log("On Hostel Id =>",req.params.id);
    console.log("Req Data =>",req.body);
    console.log("Files Data =>", req.files);
    
    try{
        const { studentName, 
                studentPhoneNo, 
                fathersName,
                fathersPhoneNo,
                dateOfBirth,
                gender, 
                email,
                state,
                city,
                address,
                roomNumber,
                startDate,
                endDate,
                isLibrary,
                isFood,
                libraryAmount,
                foodAmount,
                hostelRent,
                advancePayment,
               } = req.body;

                // Extract file names
                const studentphoto = req.files.studentphoto ? req.files.studentphoto[0].filename : null;
                const aadharcardphoto = req.files.aadharcardphoto ? req.files.aadharcardphoto[0].filename : null;

                // Calculate the number of months between startDate and endDate
                const start = new Date(startDate);
                const end = new Date(endDate);

                const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
                console.log("totalMonths==>", totalMonths);

                const MonthlyTotalAmmount = Number(libraryAmount) + Number(foodAmount) + Number(hostelRent);
                console.log("MonthlyTotalAmmount ==>",MonthlyTotalAmmount);

                 // Calculate the total amount for all months
                const totalAmount = MonthlyTotalAmmount * totalMonths;
                console.log("totalAmount==>", totalAmount);

                // const pendingAmount = totalAmount - Number(depositAmount);
                // console.log("pendingAmount==>",pendingAmount);

                // Check room availability
                const room = await Room.findOne({ roomNumber : roomNumber, createdBy : req.params.id });
                console.log("room =>",room);


                if (!room) {
                    return res.status(404).json({ message: "Room not found." });
                }

                if (room.availableBeds <= 0) {
                    return res.status(400).json({ message: "No available beds in this room." });
                }

                room.occupiedBeds += 1;
                room.availableBeds -= 1;

                await room.save();
                console.log("here---room ===>",room);

                const newStudentReserve = new StudentReservation({
                studentName,
                studentPhoneNo, 
                fathersName,
                fathersPhoneNo,
                dateOfBirth,
                gender, 
                email,
                studentphoto,
                state,
                city,
                address,
                aadharcardphoto,
                roomNumber,
                startDate,
                endDate,
                isLibrary,
                isFood,
                libraryAmount,
                foodAmount,
                hostelRent,
                advancePayment,
                MonthlyTotalAmmount,
                totalAmount,
                createdBy : req.params.id,
             }); 
            console.log("newStudentReserve ==========>",newStudentReserve);

        await newStudentReserve.save();
        res.status(201).json({message : messages.DATA_SUBMITED_SUCCESS});
        
    }catch(error){
        console.log("Error Found =>", error);
        res.status(500).json({message : messages.INTERNAL_SERVER_ERROR});
    }
} 

const index = async (req, res) => {
    console.log("In  StudentReservation controller");
    console.log("In Index id==>",req.params.id);

    try{
        let result = await StudentReservation.find({deleted : false, createdBy : req.params.id});
        console.log("All list filter with created by ===>",result);
        let total_recodes = await StudentReservation.countDocuments({deleted : false, createdBy : req.params.id});
        console.log("total_recodes==>",total_recodes);
        res.status(200).send({ result, totalRecodes: total_recodes, message : messages.DATA_FOUND_SUCCESS });

    }catch(error){
        console.log("Error =>", error);
        res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
    }
     
}

const view = async (req, res) => {
    console.log("In  StudentReservation controller");
    console.log("Id =>",req.params.id);

    try{
        let result = await StudentReservation.findById({_id : req.params.id});
        if(!result){
            return res.status(404).json({message : messages.DATA_NOT_FOUND});
        }
        console.log("result =>",result);
        res.status(200).json({result, message : messages.DATA_FOUND_SUCCESS});
    }catch(error){
        console.error("Error:", error);
        res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
    } 
} 

const edit = async (req, res) => {
    console.log("In StudentReservation controller for edit");
    console.log("Id =>", req.params.id);
    console.log("file data =>", req.files);

    try {
        const studentphoto = req.files.studentphoto ? req.files.studentphoto[0].filename : null;
        const aadharcardphoto = req.files.aadharcardphoto ? req.files.aadharcardphoto[0].filename : null;

        const start = new Date(req.body.startDate);
        const end = new Date(req.body.endDate);
        const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
        const MonthlyTotalAmmount = Number(req.body.libraryAmount) + Number(req.body.foodAmount) + Number(req.body.hostelRent);
        const totalAmount = MonthlyTotalAmmount * totalMonths;

        console.log("room=>", req.body.roomNumber);

        // Find the current reservation
        const currentReservation = await StudentReservation.findById(req.params.id);
        console.log("currentReservation==>", currentReservation);

        if (!currentReservation) {
            return res.status(404).json({ message: "Reservation not found." });
        }

        // Only update room availability if the room has changed
        if (String(currentReservation.roomNumber) !== String(req.body.roomNumber)) { // Explicitly convert to strings
            console.log("in ................");
            // Find the old room
            const oldRoom = await Room.findOne({ roomNumber: currentReservation.roomNumber });

            // Check availability in the new room
            const newRoom = await Room.findOne({ roomNumber: req.body.roomNumber });
            if (!newRoom) {
                return res.status(404).json({ message: "New room not found." });
            }

            if (newRoom.availableBeds <= 0) {
                return res.status(400).json({ message: "No available beds in the new room." });
            }

            // Update bed counts in both rooms
            if (oldRoom) {
                oldRoom.occupiedBeds -= 1;
                oldRoom.availableBeds += 1;
                await oldRoom.save();
            }
            
            newRoom.occupiedBeds += 1;
            newRoom.availableBeds -= 1;
            await newRoom.save();
        }

        const studentPhoto = req.files.studentphoto ? req.files.studentphoto[0].filename : currentReservation.studentphoto;
        console.log("studentPhoto==>",studentPhoto);

        const aadharCardPhoto = req.files.aadharcardphoto ? req.files.aadharcardphoto[0].filename : currentReservation.aadharcardphoto;
        console.log("aadharCardPhoto==>",aadharCardPhoto);

        // Update the reservation
        const updatedReservation = await StudentReservation.updateOne(
            {_id :  req.params.id},
            {
                studentName: req.body.studentName,
                studentPhoneNo: req.body.studentPhoneNo,
                fathersName: req.body.fathersName,
                fathersPhoneNo: req.body.fathersPhoneNo,
                dateOfBirth: req.body.dateOfBirth,
                gender: req.body.gender,
                email: req.body.email,
                studentphoto: studentPhoto,
                state: req.body.state,
                city: req.body.city,
                address: req.body.address,
                aadharcardphoto: aadharCardPhoto,
                roomNumber: req.body.roomNumber,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                isLibrary: req.body.isLibrary,
                isFood: req.body.isFood,
                libraryAmount: req.body.libraryAmount,
                foodAmount: req.body.foodAmount,
                hostelRent: req.body.hostelRent,
                advancePayment: req.body.advancePayment,
                MonthlyTotalAmmount: MonthlyTotalAmmount,
                totalAmount: totalAmount,
            },
            { new: true }
        );

        console.log("updatedReservation====>",updatedReservation);

        res.status(200).json({ updatedReservation, message: "Data updated successfully." });
    } catch (error) {
        console.log("Found Error While Updating User", error);
        res.status(400).json({ message: "Failed to update data." });
    }
};





const deleteData = async (req, res) => {
    try{
        console.log("In  StudentReservation controller for deleteData");
        console.log("Id:",req.params.id);
        const result = await StudentReservation.findById({_id : req.params.id});
        console.log("result=>",result);
        if(!result){
            return res.status(404).json({message: messages.DATA_NOT_FOUND_ERROR});
        }else{
          await StudentReservation.findOneAndUpdate({_id : req.params.id},{deleted : true});

          const currentRoom = await Room.findOne({roomNumber : result.roomNumber});
          console.log("currentRoom=>",currentRoom);

            if(currentRoom){
                currentRoom.occupiedBeds -= 1;
                currentRoom.availableBeds += 1;
                await currentRoom.save();
            }
            
          console.log("Student Details deleted successfully !!");
          res.status(200).json({ message: messages.DATA_DELETE_SUCCESS });
        }
      }catch(error){
        console.log("Error =>", error);
      res.status(400).json({ message: messages.DATA_DELETE_FAILED });
    }
}

const updateStatus = async (req, res) => {
    const  id = req.params.id;
     const  status  = req.body.status;

    console.log("id=>",req.params.id,"status=>",req.body.status);

    try {
        let result = await StudentReservation.updateOne(
            {_id : id},
            {
                $set : {
                    status : status
                }
            }
        );
        console.log("result==>",result);
        res.status(200).json({result, message: messages.DATA_UPDATED_SUCCESS });
       
    } catch (error) {
        res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error });
    }
}

export default {add, view, index, edit, deleteData,updateStatus};








