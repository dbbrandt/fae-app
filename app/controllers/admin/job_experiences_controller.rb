module Admin
  class JobExperiencesController < Fae::BaseController

    private

    def build_assets
      @item.build_job_image if @item.job_image.blank?
    end

  end
end
