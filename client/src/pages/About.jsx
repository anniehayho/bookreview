import React from 'react'
import about from '../assets/about.png'
import '../styles/About.css'

export default function About() {
  return (
    <div className='about-page'>
      <div className='about-img'>
        <img 
            style={{ width: '960x', height: '500px', borderRadius: '2%', marginBottom: '2%'}} 
            src={about}
          />
      </div>
      <div className='about-text'>
        <div className='about-app'>
          <h2>About the App</h2>
          <p>
            Welcome to our book review site! Here you will find thoughtful, in-depth analysis and critique of the latest fiction and nonfiction releases. 

            Our team of passionate, avid readers provides honest, unbiased reviews to help you discover your next great read. We cover a wide range of genres, from literary fiction to science fiction, memoirs to history books, and everything in between. 

            Each review offers a detailed breakdown of the book's strengths and weaknesses, key themes, character development, and overall readability. We strive to give you the information you need to decide whether a book is worth your time and money. 

            In addition to new releases, we also revisit classic works that have stood the test of time. Our archives contain reviews spanning decades of celebrated authors and titles. 

            Whether you're looking for your next book club selection, a gift for a loved one, or simply searching for your next absorbing read, you've come to the right place. Explore our reviews, discover new favorites, and enjoy delving into the world of books! 
            </p>
        </div>
        <div className='about-team'>
          <h2>About Our Team</h2>
          <p>
            <span>Owner: Nguyễn Thị Quỳnh Mai - 21522321</span> <br />
            <span>Front-End: Nguyễn Thị Quỳnh Mai - 21522321</span> <br />
            <span>Back-End: Nguyễn Thị Quỳnh Mai - 21522321</span><br />
          </p>
        </div>
      </div>
    </div>
  )
}
