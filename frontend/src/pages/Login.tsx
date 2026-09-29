import "./Login.css";
import { CalendarDays, Users, BarChart3, Mail, Lock, Eye } from "lucide-react";


function Login(){

return(

<div className="login-page">


{/* LEFT SIDE */}

<div className="left-section">


<h1>
University
<br/>
<span>Event Management</span>
<br/>
System
</h1>


<div className="yellow-line"></div>



<div className="feature">

<div className="icon-box">
<CalendarDays/>
</div>

<div>
<h3>Discover</h3>
<p>Exciting Events</p>
</div>

</div>




<div className="feature">

<div className="icon-box">
<Users/>
</div>

<div>
<h3>Participate</h3>
<p>in Activities</p>
</div>

</div>




<div className="feature">

<div className="icon-box">
<BarChart3/>
</div>

<div>
<h3>Grow</h3>
<p>Your Skills</p>
</div>

</div>



</div>





{/* LOGIN */}

<div className="login-card">


<h2>
Welcome Back
</h2>


<p>
Login to your account
</p>




<div className="input-box">

<Mail/>

<input 
type="email"
placeholder="Enter your email"
/>

</div>




<div className="input-box">

<Lock/>

<input 
type="password"
placeholder="Enter your password"
/>

<Eye/>

</div>





<div className="options">

<label>

<input type="checkbox"/>

Remember me

</label>


<a>
Forgot password?
</a>


</div>





<button className="login-btn">

Login →

</button>




<div className="or">

OR

</div>




<button className="uni-btn">

🎓 Continue with University Account

</button>




<p className="register">

Don't have an account?

<a>
Register here
</a>

</p>



</div>



</div>

)

}


export default Login;