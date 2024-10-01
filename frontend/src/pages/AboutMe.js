import ProfilePic from "./profile.jpeg"

const AboutMe = () => {
    return(
   
      <section className="flex flex-col justify-center items-center">
        <article>
          <img src={ProfilePic} alt="bill himself" className="rounded-lg m-2"/>
        </article>
        <hr class="w-[95vw] h-[2px] my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
        
        <h3 className="dark:text-white">Hey There, How's It Going!</h3>
        <h3 className="dark:text-white">My name is Will</h3>
        <p className="w-[80vw] dark:text-white">I am a recent Computer Science graduate from George Mason University (Go Patriots!)
          I am a man of many interests and hobbies: boxing, road tripping (I have been on three cross country roadtrips), autonomous 
          driving, and distributed systems. I am eagar to break into the industry to display and apply all of the skills that I have
          learned from university. From using print("hello") learnt from my introductory Python class
          to knowing how to develop an N-Tier Archtiecture. Words cannot describe how I excited I am to work
          for a well established company that has cutting edge products that will make a positive impact on the world.
          If you graciously have a venture as such, I would be more than honored for you to contact me.
        </p>
        <h3 className="dark:text-white">Thanks for reading :)</h3>
      </section>
   
    );
}

export default AboutMe;