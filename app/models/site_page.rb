class SitePage < Fae::StaticPage

  @slug = 'site'

  # required to set the has_one associations, Fae::StaticPage will build these associations dynamically
  def self.fae_fields
    {
      headline: { type: Fae::TextField },
      image_narrow: { type: Fae::Image },
      image_medium: { type: Fae::Image },
      image_wide: { type: Fae::Image },
      google_link: { type: Fae::TextField },
      linkedin_link: { type: Fae::TextField },
      twitter_link: { type: Fae::TextField }
    }
  end

end
