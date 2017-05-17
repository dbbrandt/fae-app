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
