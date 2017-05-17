# README

##Objective: Learn about fae-cms and brush up on Rails 5

###Background
I've been developing with Ruby for about six years following a dozen years or more of Java. I generally focus on server and infrastructure development. Around 2009 I started looking at Groovy (Grails), a dynamic language that runs in the JVM. I used it in a consulting project to build a vertical social networking site for a client. It was pretty cool but it still had all the baggage and complexity of the Java ecosystem and it's libraries. It did make delivering a full stack app relatively easy with some help from a designer on the HTML/CMS.

###For the love of Ruby
I love Ruby! It's fun. Yes, there are many ways to do the same thing but isn't that just like the real world? It leaves a lot of room for creativity. 

I was introduced to Ruby in the context of Rails 3. There is a downside to starting Ruby with Rails in that you spend more time learning about Rails conventions and less on the Ruby language. After a few years I got involved with a great project that was pure Ruby. Any features needed were added with individual gems. For example, the ORM we used was Sequel, a powerful alternative to ActiveRecord. 

###Brushing up on Rails with FAE-CMS
This blog is about coming back to Rails 5 and having to get back up to speed with the Rails framework in it's latest incarnation. 

I was rusty with Rails. I was:

* Not that familiar with the Rails asset pipeline which automates many tedious asset deployment details.  
* Not familiar with the Concerns pattern introduced in Rails 4.
* Needed refreshing on the Rails routing and MVC conventions.
* Needed an update on the latest Rails configuration details.

At the same time, I was looking to build a personal consulting site that could host a blog. At about that time, I came across [fae-cms](https://www.faecms.com/documentation) which was created and recently open-sourced by [Fine Design Group](https://www.wearefine.com/). It is a Rails 5 based content management system (CMS), more a framework than a full CMS and packaged as a gem. I has reasonable hooks to and features with and extend for your own needs. I decided, why not evaluate it while building my site. Fae-cms was developed by Fine as an internal project to accelerate custom site development. If it works for them, maybe I could use it to build a general purpose site that supports blogging.

###A novice's guide to using fae-cms

_What you need to get started:_

* A Ruby development environment with Ruby version >=2.2.2
* A database ready to migrate tables into
* Basic familiarity with Ruby syntax and Rails basics.
* Some basic site assets (HTML and CSS) for your home and about page.
   Note: You can use mine as a starting point if you want. I will be sharing my source code for this project below. 

_What you will build_

The plan is to build a responsive site with a home page that lists job experience and an about page that is acts as a mini CV. We want to use fae-cms to manage all the data needed for the pages so the static content can be updated and stored in the database. 

_The admin pages are all generated for you._

There is virtually no coding needed to get a pretty decent admin site up and running. That's not a new concept but fae-cms provides a bunch more functionality than say ActiveAdmin. 

Here is what the final product will look like.

![Precidix Admin](http://www.precidix.com/blogs/Precidix-fae-admin.png)

Fae-cms is based on responsive design so, of course, we will build the static pages for our home and about pages using responsive design. Essentially that means we will leverage CSS and Javascript to make the pages work on any form factor. Here is what the static pages look like with externally created style sheets and CSS.

![Precidix Site](http://www.precidix.com/blogs/Precidix-site-cutout.png)


####Using CoffeCup Responsive Site Desinger to build my pages

As a primarily back end developer, I'm not an expert at designing a stylish responsive site. I decided to use [CoffeeCup](http://www.coffeecup.com/designer/), another great tool which does the job and is a nice way learn responsive site design through an interactive UX. Once done, it generates all the necessary files. I got what I needed and easily created the HTML, CSS and Javascript to do the home and about pages.

##So let's get started!

1. Create a new project locally   
`rails new  fae-app`
2. Add the *fae-rails* gem to the Gemfile   
`# The Rails CMS`  
`gem 'fae-rails'`
4. Add the slim gem to generate slim rather than erb views. [Slim](http://www.rubydoc.info/gems/slim/frames) is an alternative to HAML with a slightly different syntax. Since FAE uses slim, it mades sense to use it for the other pages. It's efficient and to HAML.   
`# Use SLIM for HTML`   
`gem 'slim-rails', '~> 3.1'`
5. Install a gem, `redcarpet`, to allow us to use markdown in our text field content. Fae-cms provides a markdown editor out of the box.   
`# Used to render markup text fields as HTML`
`gem 'redcarpet', '~> 3.4'`
6. Run bundler   
`bundle install`
`Note I had some issues on OSX and had to install an older version of image magic to get the native builds to succeed`
7. Initialize and generate the fae-cms code and tables.   
`rails g fae:install`   
8. Convert the `app/views/layouts` generated as `*.html.erb` to `.html.slim`. This releates to three files: `application.html.slim, mailer.html.slim, mailer.text.slim` 
9. Started up the server.   
`rails s`
10. Setup the fae-cms super-user in the browser. Fae-cms has a first time init user page.
`http://localhost:3000/admin`

![Fae startup page](http://www.precidix.com/blogs/Fae-first-time-login.png)

###Next we customize for our requirements

This site will have two static pages, home and about. It will also have dynamic content for the job experience shown on the home page. Fae-cms supports a special controller and models for static pages. Like most CMS's, fae-cms stores content for it's static pages in generic content tables. It also supports regular models for storing any relational data that can be injected into your static pages. For both types of models, static page and ActiveRecord, fae-cms generates the admin pages for you. 

####We will begin with the About Us page

Let's generate the About Us static page. This is similar to a generating a Rails scaffold but generates the fae files for administering the page content.     
`rails g fae:page AboutUs intro:text hero_image:image headline:string body:text profile_link:string profile_image:image`

Output:   
`create  app/controllers/admin/content_blocks_controller.rb`   
`create  app/models/about_us_page.rb`   
`create  app/views/admin/content_blocks/about_us.html.slim`


An `about_us_page.rb` is created which declares an Fae::StaticPage model and its attribute explicitely. Fae-cms stores these attributes in its generic content tables rather than using standard ActiveRecord to store them in a model specific table.

Here is the AboutUs model in `about_us_page.rb` 

```
class AboutUsPage < Fae::StaticPage

  @slug = 'about_us'

  # required to set the has_one associations, Fae::StaticPage will build these associations dynamically
  def self.fae_fields
    {
      intro: { type: Fae::TextField },
      hero_image: { type: Fae::Image },
      headline: { type: Fae::TextField },
      body: { type: Fae::TextArea },
      profile_link: {
          type: Fae::TextField,
          validates: Fae.validation_helpers.url
      },
      profile_image: { type: Fae::Image }
    }
  end
end
```

For this StaticPage model, I added an extra validation. This validation must be defined inside the fae_fields attribute declaration block. Fae provides a range of [validation helpers](https://www.faecms.com/documentation/topics-models#validation) for the more common, non-trivial validations. See the `profile_link` field above for url validation. 

####Modify the admin menu structure as desired.

The admin menu is generated by a model concern. A file, `app/models/concerns/fae/navigation_concern.rb` is created with a default menu. I added a sub-menu structure to the basic layout to provide for longer term requirements. 

```
def structure
  [
    item('Pages', subitems: [
      item('About Us', path: fae.edit_content_block_path('about_us'))
    ])
  ]
end
```

Now, you can go into the admin site and fill in the content for the About Us page. So far all we have is  data but no webpage view. 
`http://localhost:3000/admin/content_blocks/about_us`

![about us page](http://www.precidix.com/blogs/Fae-static-page-admin.png)

###Fae-cms only generates admin views

This is somewhat confusing when you think of a normal CMS. Fae-cms just creates admin pages and it's up to you to leverage their framework to create the actual site. The admin pages can be used to maintain your pages and content. 

We now need to add views to the site to make use of what was generated in the admin site. Fae-cms documentation is pretty good but it seems to end before you see how to use it to make a site. It assume you have reviewed their sourced code and really know what your are doing.

####Home Page
We started with About Us because all of its data is defined in the StaticPage model. The home page requirements are more complicated. 

*GOAL* - Create a Static home page that leverages an Fae::StagicPage model to populate the common data on the home page and create a JobExperience model to populate the grid on the home page. 

On this site, every page has some common data including a menu, banner image and footer. Rather than generating an explicit static home page, I decided to create a generic *Site* StaticPage with common fields. This Site StaticPage is used to populate the shared parts of all the pages on the site.

Generate a generic static pages controller.
`rails generate controller StaticPages home`



Generate the site StaticPage:
`rails g fae:page Site headline:string image_narrow:image    
 image_medium:image image_wide:image google_link:string linkedin_link:string twitter_link:string`

Here is the resulting class in `app/models/site_page.rb`.

```
class SitePage < Fae::StaticPage

  @slug = 'site'

  # required to set the has_one associations, Fae::StaticPage will build these associations dynamically
  def self.fae_fields
    {
      title: { type: Fae::TextField },
      headline: { type: Fae::TextField },
      image_narrow: { type: Fae::Image },
      image_medium: { type: Fae::Image },
      image_wide: { type: Fae::Image },
      google_link: { type: Fae::TextField },
      linkekin_link: { type: Fae::TextField },
      twitter_link: { type: Fae::TextField }
    }
  end

end
```

###Now how do I build an actual site

At this point, we still only have an admin site. This is where you start to lean on prior Rails knowledge. You have to create the controllers and views to support the static page data you created in fae's admin pages. The current documentation on Fine doesn't have examples of how to do this. We need to figure out how to get access to the data stored in FAE content tables on our site pages.

####Using Fae::StaticPages

I looked through all the documentation an couldn't find any instructions on how to do this. I felt at a loss and frustrated with what I assumed was my lack of sufficient Rails expertise. So, I looked at the source code since this is and open-source project.

I began to understand how an FAE:StaticPage is dynamically created from the meta data declared in the model and the data stored in the database. The specific attributes of your StaticPage are not added until the class's :instance method is called. Until then it is just a FAE:StaticPage with the common attributes found in the Fae::StaticPage class.

For the AboutUs page, this is done by the statement, `@about_us = AboutUs.instance`. This instantiates the object and adds all the fields and their values as stored in the database.

####A generic static page controller

You could create a controller and related views for each static page. Since these pages are basically static, there is not much special logic in each controller. This is a case for a common controller with and some meta programming. 

I created a common route to a `StaticPagesController` which uses the action to determine which page to instantiate.

routes.rb

`root "static_pages#show", page: 'home'`    
`get "/pages/:page" => "static_pages#show"`

The :page parameter determines which static page to instantiate and render.

`static_pages_controller.rb`

```
class StaticPagesController < ApplicationController

  def show
    page_name = (params[:page] + "_page").classify

    @item = page_name.constantize.instance rescue nil
    # shared elements on all pages
    @site = SitePage.instance

    @jobs = JobExperience.order(:order).all if params[:page] == 'home'

    render "static_pages/#{params[:page]}"
  end
end
```

The show method does all the work. It first turns the page parameter into a class name using the `classify` method on a string. Next we create the class name from the string using `constantize`. The rescue is there incase an invalid action for which there is no model is passed in. The StaticPage class is then instantiated with the `instance` method provided by the Fae::StaticPage class. 

Here we also instantiate the SitePage object for the common attributes used on every page. I will skip the JobExperience explanation as it will be covered later.

#####Side note about inflectors needed for "about_us"

Whey you `classify` the path `about_us` you get the annoying result "AboutU". Apparently U is the singular of Us.

``` 
>> "about_us".classify
"AboutU"
```

Since the static page class is `AboutUs`, we need to tell ActiveSupport::Inflector, which defines the classify method, to get it right! [ActiveSupport](http://guides.rubyonrails.org/active_support_core_extensions.html) *'is the Ruby on Rails component responsible for providing Ruby language extensions, utilities, and other transversal stuff.'*

Rails creates a file `config/initializers/inflectors.rb` where you can modify inflection rules. Modification start are commented out when a Rails application is generated. I have added back one to deal with "about_us".

```
# Be sure to restart your server when you modify this file.

# Add new inflection rules using the following format. Inflections
# are locale specific, and you may define rules for as many different
# locales as you wish. All of these examples are active by default:
 ActiveSupport::Inflector.inflections(:en) do |inflect|
#   inflect.plural /^(ox)$/i, '\1en'
#   inflect.singular /^(ox)en/i, '\1'
#   inflect.irregular 'person', 'people'
   inflect.uncountable %w( about_us )
 end

# These inflection rules are supported but not enabled by default:
# ActiveSupport::Inflector.inflections(:en) do |inflect|
#   inflect.acronym 'RESTful'
# end
```


####Creating the Views
                       
We created a controller, `static_page_controller`, that will route to the view based on the page name. We now have to create the views `home.html.slim` and `about_us.html.slim` in the `app/views/static_pages` directory. This is where get into our *asset pipeline, slim and responsive design skills.*

As mentioned before, I created the static site in [CoffeeCup's Responsive Site Designer](http://www.coffeecup.com/designer/). The Responsive Site Designer generates your site with all the necessary files. This includes some Javascript libraries that need to be copied to the `app/assets/javascript` directory for the asset pipeline: *foundation.js, outofview.js, picturefill.js and what-input.js.*  

In addition there are:

* Style sheets which need to be put in `app/assets/stylesheets`
* Fonts which need to be put in `app/assets/fonts` 
* HTML that must be incorporated in the site views 

All of these were not generated for the asset pipeline or for slim, so they will need some alteration.

All style sheets can be changed from `.css` to `.scss` to support the added features provided by SCSS if desired.

Finally, we want to make menus, banners and footers reusable so we will factor out some html into partials. Here is what I ended up creating:

```
_banner.html.slim               
_job.html.slim                  
_footer.html.slim               
_menu.html.slim                 
_responsive_banner.html.slim    
home.html.slim
about_us.html.slim
```

This involved breaking up the html into its parts and converting them to slim. It turned out to be pretty straight forward and a good way to learn the implementation of responsive design done by CoffeeCup. 

####Altering generated assets for the asset-pipeline

After adding the coffee_cup fonts, you need to modify the `foundation.css` to use asset_url() instead of the standard url() to reference font files. You also need to remove the relative path, in this case `../fonts` as this is handled by the Rails asset pipeline.

Example of before these changes:
`src: url('../fonts/coffeecup-font-icons.eot?cc-w484d8')`

After these changes:
`src: asset_url('coffeecup-font-icons.eot?cc-w484d8');`

Images references also need to be changed when they are placed in `app\assets\images`. They will look something like `img src=“#{asset_path(“image.png”)}”`.

####Accessing the FAE model data in the view

Fae-cms populates an @item or @items variable to store the model data or an array of models for the index page. For static pages, here is how you reference the @item data in your view based on the attribute type:

* title:   @item.title
* textfield: @item.myFieldname.content
* textarea:  sanitize @item.myFieldname.content    # sanitize if it might contain HTML
  (sanitize if it contains html)
* image or file: @item.myFieldname.asset.url or @item.myFieldname.asset.thumb.url (for the thumbnail size)
* image alt-text: @item.myFieldname.alt


Below is an example from the file I created for the home page view, `home.html.slim`:

```
== render :partial => 'static_pages/responsive_banner', :locals => { title: @site.title,  intro: @site.headline.content }
div class="row section-headling-row"
  div class="columns small-12 column-5"
    h1 class="quotes-heading"
      span class="heading-text-2" Projects
  - for job in @jobs do
    == render :partial => 'static_pages/job',
            :locals => { title: job.title, image: job.job_image.asset.url, url: job.job_link, copy: job.body }
```

####Text as markdown

The textarea field type supports a markdown editor. To display these, you need to add a gem and an application_helper.

In the Gemfile we already added `gem 'redcarpet', '~> 3.4'`.

In `/app/helpers/application_helpers.rb` we need to add a method for `markdown`.

```
def markdown(text)
  markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML,
                                   no_intra_emphasis: true,
                                   fenced_code_blocks: true,
                                   disable_indented_code_blocks: true)
  return markdown.render(text).html_safe
end
```

In the view, simply put `#{markup @item.body.content}` where  `body` is an example of a textarea field containing markdown.

####Page Layout

In the `views/layouts/application.html.slim` we add code to include content loaded into every page.

```
  body
    == render 'static_pages/menu'

    == yield

    == render 'static_pages/footer'
```

####Adding non-StaticPage data to your pages

For this site, we want show job experience on the home page. This includes multiple records on a single Home page. StaticPages only have a single instance of data. 

To do this:

* Create the jobs experience model     
`rails g fae:scaffold JobExperience title:string order:integer body:text job_image:image job_link:text date:date`

* We also want the order to default to an integer value, 0. This field allows us to order the expeirence any way we want. Add a migration to do this.
`rails g migration ChangeColumtDefaultForOrderInJobExperience`

```
class ChangeColumnDefaultForOrderInJobExperience < ActiveRecord::Migration[5.0]
  def change
    change_column_default :job_experiences, :order, 0
  end
end
```

* Migrate the new table.
`rails db:migrate`

* Add the desired validation to the JobExperience model

```
class JobExperience < ApplicationRecord
  include Fae::BaseModelConcern

  def fae_display_field
    title
  end

  has_fae_image :job_image

  validates :title, presence: true
  validates :body, presence: true
  validates :job_link, Fae.validation_helpers.url
end
``` 

* Add Jobs to the Admin Menu. We create this is a sub-submenu for Home in
the `add/models/concerns/fae/navication_concern.rb`.

```
    def structure
      [
          item('Pages', subitems: [
              item('About Us', path: fae.edit_content_block_path('about_us')),
              item('Site', path: fae.edit_content_block_path('site')),
              item('Job Experience', path: admin_job_experiences_path)
          ])
      ]
    end
```

* Make the body support markdown on input.
  Edit the `app/views/admin/job_experience/_form_html.slim`. 
  For example blow the `:body` field will be inputed using a markdown editor.

```
= simple_form_for(['admin', @item]) do |f|
  header.content-header.js-content-header
    == render 'fae/shared/form_header', header: @klass_name
  == render 'fae/shared/errors'

  main.content
    = fae_input f, :title
    = fae_input f, :order
    = fae_input f, :body, markdown: true
    = fae_input f, :job_link
    = fae_input f, :date


    = fae_image_form f, :job_image

```

* Read the jobs list into a variable in the `static_pages_controller`. While the approach here is a bit kludgy since only the home page uses it, I guess it's ok for this tiny site. Refactoring would be in order if the site had many pages.

```
class StaticPagesController < ApplicationController

  def show
    page_name = (params[:page] + "_page").classify

    @item = page_name.constantize.instance rescue nil
    # shared elements on all pages
    @site = SitePage.instance

    @jobs = JobExperience.order(:order).all if params[:page] == 'home'

    render "static_pages/#{params[:page]}"
  end
```

* Use the new `@jobs` variable in the home page to iterate through the jobs and display a partial for each job. See the `home.html.slim` in the section *Accessing the FAE model data in the view* for the source code.

###Done!

I found this exercise to be a great learning tool for Rails 5 and a challenging introduction to fae-cms. Fae-cms is tempting to use as a general application site builder. For simple sites it may well be a great way to quickly get something up and running. If you become an expert in Fine's implementation, you may want to use it, extend or even fork it to be your go to website framework like at Fine. Enjoy!
 



