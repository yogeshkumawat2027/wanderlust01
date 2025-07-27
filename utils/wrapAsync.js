module.exports = (fn) => {
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}

//WrapAsync for reduce try and catch block