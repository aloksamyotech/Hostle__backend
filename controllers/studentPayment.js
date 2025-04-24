import Payment from '../model/Payment.js'
import StudentReservation from '../model/StudentReservation.js';
import messages from '../constants/message.js'

// const add = async (req,res ) => {
//     console.log("in payment controller id=>",req.params.id);
//     console.log("req.body Dataaaaaaaa =>", req.body);
//     console.log("File Data paymentAttachment =>", req.file);
//     try{
//         console.log("in try");
//         const {studentName, month, paymentDate, paymentType, paymentAmount,} = req.body;

//         let data = await StudentReservation.findOne({studentName : studentName });
//         console.log("student Data =>",data);

//         let studentId = data._id;
//         console.log("studentId==>",studentId);

//         let totalAmmount = data.totalAmount; 
//         console.log("totalAmount => ",totalAmmount);

//         let monthlyAmmount = data.MonthlyTotalAmmount;
//         console.log("monthlyAmmount => ",monthlyAmmount);



//         let monthlyPending = monthlyAmmount - paymentAmount ;
//         console.log("monthlyPending =>",monthlyPending);



//         let totalPending  = (totalAmmount - paymentAmount) + monthlyPending ;
//         console.log("totalPending =>",totalPending);

//         const newPayment = new Payment({
//             studentId,
//             studentName,
//             month,
//             paymentDate,
//             paymentType,
//             paymentAmount,
//             totalAmmount,
//             monthlyAmmount,
//             monthlyPending,
//             totalPending,
//             paymentAttachment : req.file.filename,
//             createdBy : req.params.id,
//         });
//         newPayment.save();
//         console.log("newPayment==>",newPayment);

//         res.status(201).json({ message : messages.DATA_SUBMITED_SUCCESS});
//     }catch(error){
//         console.log("Error Found While add Data",error);
//         res.status(500).json({ message : messages.INTERNAL_SERVER_ERROR});
//     }
// }

const add = async (req, res) => {
    console.log("in payment controller id=>", req.params.id);
    console.log("req.body Data =>", req.body);
    console.log("File Data paymentAttachment =>", req.file);
    
    try {
        console.log("in try");
        const { studentName, month, paymentDate, paymentType, paymentAmount } = req.body;

        // Fetch student data by name
        let studentData = await StudentReservation.findOne({ studentName: studentName });
        if (!studentData) {
            return res.status(404).json({ message: "Student not found" });
        }
        
        console.log("student Data =>", studentData);
        let studentId = studentData._id;
        let studentPhoneNo = studentData.studentPhoneNo;

        let libraryAmount = studentData.libraryAmount;
        let foodAmount = studentData.foodAmount;
        let hostelRent = studentData.hostelRent;

        let monthlyTotalAmount = studentData.MonthlyTotalAmmount;
        let totalAmmount = studentData.totalAmount; 

       

        // Fetch the latest payment data for the student
        let latestPayment = await Payment.findOne({ studentId: studentId }).sort({ paymentDate: -1 });
        
        let monthlyPending = monthlyTotalAmount - paymentAmount;
        let totalPending = totalAmmount - paymentAmount;

        if (latestPayment) {
            console.log("Latest Payment Data =>", latestPayment);
            // Update monthlyPending and totalPending if there is a previous record
            monthlyPending += latestPayment.monthlyPending;
            totalPending = latestPayment.totalPending - paymentAmount;
        }
        
        console.log("monthlyPending =>", monthlyPending);
        console.log("totalPending =>", totalPending);

        const newPayment = new Payment({
            studentId,
            studentName,
            studentPhoneNo,
            month,
            paymentDate,
            paymentType,
            paidAmount : paymentAmount,

            libraryAmount,
            foodAmount,
            hostelRent,

            monthlyTotalAmount,
            totalAmmount,

            monthlyPending,
            totalPending,

            paymentAttachment: req.file ? req.file.filename : undefined,
            createdBy: req.params.id,
        });

        await newPayment.save();
        console.log("newPayment =>", newPayment);

        res.status(201).json({ message: "Data submitted successfully" });
    } catch (error) {
        console.log("Error Found While adding Data", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const index = async (req,res) => {
    console.log("In index in payment id=>", req.params.id);
    try{
        let result = await Payment.find({deleted : false, createdBy : req.params.id});
        let total_recodes = await Payment.countDocuments({deleted : false, createdBy : req.params.id});
        res.status(200).send({ result, totalRecodes: total_recodes, message : messages.DATA_FOUND_SUCCESS });
    }catch(error){
        console.log("Error =>", error);
        res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
    }
}

const view = async (req, res) => {
    try{
        console.log("In view Id=====>",req.params.id);
        const result = await Payment.find({studentId : req.params.id });
        const total_recodes = await Payment.countDocuments({studentId : req.params.id});
        console.log("result==>",result, "total_recodes==>",total_recodes);
        res.status(200).send({ result, totalRecodes: total_recodes, message : messages.DATA_FOUND_SUCCESS });

    }catch(error){
        console.log("Error =>", error);
        res.status(400).json({ message: messages.DATA_NOT_FOUND_ERROR });
    }
}

export default { add, index, view}