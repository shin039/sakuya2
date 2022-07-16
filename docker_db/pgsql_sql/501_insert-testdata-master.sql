-- ============================================================================
-- Insert Test Data
-- ============================================================================

-- m_staff
INSERT INTO m_staff
  (userid , passwd                              , name             , birthday     , tel  , mail , is_delete , regist_staff , regist_time)
VALUES
  ('test' , crypt('yourpasswd', gen_salt('bf')) , 'テストユーザー' , '1900/01/01' , ''   , null , False     , 1            , '2021/01/01 12:00:00')
 ,('demo' , crypt('demopasswd', gen_salt('bf')) , 'デモユーザー'   , '2000/01/01' , null , null , False     , 1            , '2021/01/01 12:00:00')
ON CONFLICT(userid) DO UPDATE SET userid = EXCLUDED.userid;


-- パスワードを検証する場合
-- select userid, (passwd = crypt(userid, passwd)) from m_staff;

