class ChangeColumtDefaultForOrderInJobExperience < ActiveRecord::Migration[5.0]
  def change
    change_column_default :job_experiences, :order, 0
  end
end
